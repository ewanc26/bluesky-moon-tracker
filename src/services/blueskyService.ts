import * as process from "process";
import { getMoonPhase } from "./moonPhaseService";
import { getPlayfulMoonMessage } from "../core/moonPhaseMessages";
import { BskyAgent, RichText, AppBskyRichtextFacet } from "@atproto/api";

/**
 * Manually creates a hashtag facet for the given text and hashtag
 */
function createHashtagFacet(text: string, hashtag: string): AppBskyRichtextFacet.Main | null {
  const hashtagWithHash = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
  const hashtagIndex = text.lastIndexOf(hashtagWithHash);
  
  if (hashtagIndex === -1) {
    return null;
  }

  // Use TextEncoder to get proper UTF-8 byte offsets
  const encoder = new TextEncoder();
  const beforeHashtag = text.substring(0, hashtagIndex);
  const hashtagText = hashtagWithHash;
  
  const byteStart = encoder.encode(beforeHashtag).length;
  const byteEnd = byteStart + encoder.encode(hashtagText).length;

  return {
    index: {
      byteStart,
      byteEnd,
    },
    features: [{
      $type: 'app.bsky.richtext.facet#tag',
      tag: hashtag.replace(/^#/, ''), // Remove # from the tag value
    }],
  };
}

export async function postMoonPhaseToBluesky() {
  console.log("Attempting to post moon phase to Bluesky.");

  // Check for empty environment variables and abort if needed
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    console.error(
      "Missing required environment variables: BLUESKY_USERNAME and BLUESKY_PASSWORD.\nAborting script."
    );
    process.exit(1);
  }

  const pdsUrl = process.env.BLUESKY_PDS_URL || "https://bsky.social";
  const agent = new BskyAgent({ service: pdsUrl });

  try {
    // Login to Bluesky
    await agent.login({
      identifier: process.env.BLUESKY_USERNAME!,
      password: process.env.BLUESKY_PASSWORD!,
    });
    console.log("Logged in to Bluesky.");

    // Get moon phase data
    const moonPhaseData = await getMoonPhase();

    if (moonPhaseData) {
      const { message: postText, hashtag } = getPlayfulMoonMessage(
        moonPhaseData.Phase,
        moonPhaseData.Illumination * 100,
        new Date().getMonth()
      );

      // Create RichText object
      const rt = new RichText({
        text: postText,
      });
      
      // First, detect facets automatically (for links, mentions, etc.)
      await rt.detectFacets(agent);

      // Then, manually ensure hashtag facet is correct
      const hashtagFacet = createHashtagFacet(postText, hashtag);
      
      if (hashtagFacet) {
        // Check if hashtag facet already exists from automatic detection
        const existingHashtagFacet = rt.facets?.find(facet => 
          facet.features.some(feature => 
            feature.$type === 'app.bsky.richtext.facet#tag' && 
            feature.tag === hashtag.replace(/^#/, '')
          )
        );

        if (!existingHashtagFacet) {
          // Add our manually created hashtag facet
          rt.facets = [...(rt.facets || []), hashtagFacet];
          console.log("Manually added hashtag facet.");
        } else {
          console.log("Hashtag facet already detected automatically.");
        }
      }

      // Sort facets by byteStart to ensure proper ordering
      if (rt.facets && rt.facets.length > 1) {
        rt.facets.sort((a, b) => a.index.byteStart - b.index.byteStart);
      }

      // Post the moon phase information to Bluesky
      const postRecord = {
        text: rt.text,
        facets: rt.facets,
        langs: ["en"],
        createdAt: new Date().toISOString(),
      };

      await agent.post(postRecord);
      console.log("Just posted:", postText);
      
      // Debug: Log the facets that were sent
      if (process.env.DEBUG_MODE === "true") {
        console.log("Final facets sent with post:");
        console.log(JSON.stringify(rt.facets, null, 2));
        
        // Verify UTF-8 encoding
        const encoder = new TextEncoder();
        const utf8Bytes = encoder.encode(postText);
        console.log(`Post text UTF-8 length: ${utf8Bytes.length} bytes`);
        console.log(`Post text character length: ${postText.length} characters`);
      }
    } else {
      console.log("Could not retrieve moon phase data to post.");
    }
  } catch (error) {
    console.error("Error during Bluesky posting process:", error);
  }
}
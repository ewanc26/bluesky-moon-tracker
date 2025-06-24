import { BskyAgent, RichText, AppBskyRichtextFacet } from "@atproto/api";
import { getMoonPhase } from "./moonPhaseService";
import { getPlayfulMoonMessage } from "../core/moonPhaseMessages";
import type { BlueskyPost } from '../types/moonPhase';

export class BlueskyService {
  private agent: BskyAgent;
  private readonly pdsUrl: string;

  constructor(pdsUrl: string = "https://bsky.social") {
    this.pdsUrl = pdsUrl;
    this.agent = new BskyAgent({ service: this.pdsUrl });
  }

  private validateCredentials(): { username: string; password: string } {
    const username = process.env.BLUESKY_USERNAME;
    const password = process.env.BLUESKY_PASSWORD;

    if (!username || !password) {
      throw new Error("Missing required environment variables: BLUESKY_USERNAME and BLUESKY_PASSWORD");
    }

    return { username, password };
  }

  private createHashtagFacet(text: string, hashtag: string): AppBskyRichtextFacet.Main | null {
    const hashtagWithHash = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    const hashtagIndex = text.lastIndexOf(hashtagWithHash);
    
    if (hashtagIndex === -1) {
      console.warn(`Hashtag ${hashtagWithHash} not found in text`);
      return null;
    }

    const encoder = new TextEncoder();
    const beforeHashtag = text.substring(0, hashtagIndex);
    const hashtagText = hashtagWithHash;
    
    const byteStart = encoder.encode(beforeHashtag).length;
    const byteEnd = byteStart + encoder.encode(hashtagText).length;

    return {
      index: { byteStart, byteEnd },
      features: [{
        $type: 'app.bsky.richtext.facet#tag',
        tag: hashtag.replace(/^#/, ''),
      }],
    };
  }

  private async processRichText(postText: string, hashtag: string): Promise<RichText> {
    const rt = new RichText({ text: postText });
    
    // Detect facets automatically
    await rt.detectFacets(this.agent);

    // Manually ensure hashtag facet is correct
    const hashtagFacet = this.createHashtagFacet(postText, hashtag);
    
    if (hashtagFacet) {
      const existingHashtagFacet = rt.facets?.find(facet => 
        facet.features.some(feature => 
          feature.$type === 'app.bsky.richtext.facet#tag' && 
          feature.tag === hashtag.replace(/^#/, '')
        )
      );

      if (!existingHashtagFacet) {
        rt.facets = [...(rt.facets || []), hashtagFacet];
        console.log("Manually added hashtag facet");
      } else {
        console.log("Hashtag facet already detected automatically");
      }
    }

    // Sort facets by byteStart
    if (rt.facets && rt.facets.length > 1) {
      rt.facets.sort((a, b) => a.index.byteStart - b.index.byteStart);
    }

    return rt;
  }

  private createPostRecord(rt: RichText): BlueskyPost {
    return {
      text: rt.text,
      facets: rt.facets,
      langs: ["en"],
      createdAt: new Date().toISOString(),
    };
  }

  private logDebugInfo(postText: string, rt: RichText): void {
    if (process.env.DEBUG_MODE === "true") {
      console.log("Final facets sent with post:");
      console.log(JSON.stringify(rt.facets, null, 2));
      
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(postText);
      console.log(`Post text UTF-8 length: ${utf8Bytes.length} bytes`);
      console.log(`Post text character length: ${postText.length} characters`);
    }
  }

  public async login(): Promise<void> {
    const { username, password } = this.validateCredentials();
    
    try {
      await this.agent.login({ identifier: username, password });
      console.log("Successfully logged in to Bluesky");
    } catch (error) {
      console.error("Failed to login to Bluesky:", error);
      throw new Error("Bluesky authentication failed");
    }
  }

  public async postMoonPhase(): Promise<void> {
    console.log("Attempting to post moon phase to Bluesky");

    try {
      await this.login();

      const moonPhaseData = await getMoonPhase();
      if (!moonPhaseData) {
        throw new Error("Could not retrieve moon phase data");
      }

      const { message: postText, hashtag } = getPlayfulMoonMessage(
        moonPhaseData.Phase,
        moonPhaseData.Illumination * 100,
        new Date().getMonth()
      );

      const rt = await this.processRichText(postText, hashtag);
      const postRecord = this.createPostRecord(rt);

      await this.agent.post(postRecord);
      console.log("Successfully posted:", postText);
      
      this.logDebugInfo(postText, rt);

    } catch (error) {
      console.error("Error during Bluesky posting process:", error);
      throw error;
    }
  }
}

export async function postMoonPhaseToBluesky(): Promise<void> {
  const pdsUrl = process.env.BLUESKY_PDS_URL || "https://bsky.social";
  const service = new BlueskyService(pdsUrl);
  await service.postMoonPhase();
}

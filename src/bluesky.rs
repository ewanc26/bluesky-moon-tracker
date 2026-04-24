//! Bluesky posting via atrium-api.

use std::str::FromStr;

use atrium_api::agent::atp_agent::AtpAgent;
use atrium_api::agent::atp_agent::store::MemorySessionStore;
use atrium_api::app::bsky::feed::post::RecordData;
use atrium_api::com::atproto::repo::create_record::InputData;
use atrium_api::types::{string::Datetime, string::Language, Collection, TryIntoUnknown};
use atrium_xrpc_client::reqwest::ReqwestClient;
use chrono::Datelike;

use crate::moon::api;
use crate::moon::messages;

pub struct BlueskyService {
    agent: AtpAgent<MemorySessionStore, ReqwestClient>,
    http_client: reqwest::Client,
    ollama_model: Option<String>,
    ollama_url: Option<String>,
    ollama_timeout: Option<u64>,
}

impl BlueskyService {
    pub fn new(
        pds_url: &str,
        http_client: reqwest::Client,
        ollama_model: Option<String>,
        ollama_url: Option<String>,
        ollama_timeout: Option<u64>,
    ) -> Self {
        let xrpc_client = ReqwestClient::new(pds_url);
        let agent = AtpAgent::new(xrpc_client, MemorySessionStore::default());
        Self {
            agent,
            http_client,
            ollama_model,
            ollama_url,
            ollama_timeout,
        }
    }

    pub async fn login(&self, username: &str, password: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.agent.login(username, password).await?;
        println!("Successfully logged in to Bluesky");
        Ok(())
    }

    pub async fn post_moon_phase(&self, username: &str, password: &str) -> Result<(), Box<dyn std::error::Error>> {
        println!("Attempting to post moon phase to Bluesky");
        self.login(username, password).await?;

        let moon_data = api::get_moon_phase(&self.http_client).await;
        println!("Moon phase source: {}", moon_data.source);

        let month_index = chrono::Utc::now().month0() as usize;
        let msg = messages::generate_message(
            moon_data.phase,
            moon_data.illumination,
            month_index,
            self.ollama_model.as_deref(),
            self.ollama_url.as_deref(),
            self.ollama_timeout,
            &self.http_client,
        )
        .await;

        // Build facets for the hashtag
        let facets = build_hashtag_facets(&msg.message, &msg.hashtag);

        let en_lang = Language::from_str("en").expect("valid language tag");

        let record = RecordData {
            created_at: Datetime::now(),
            embed: None,
            entities: None,
            facets: if facets.is_empty() { None } else { Some(facets) },
            labels: None,
            langs: Some(vec![en_lang]),
            reply: None,
            tags: None,
            text: msg.message.clone(),
        };

        let session = self.agent.get_session().await
            .ok_or("No active session — login failed")?;

        self.agent
            .api
            .com
            .atproto
            .repo
            .create_record(
                InputData {
                    collection: atrium_api::app::bsky::feed::Post::nsid(),
                    record: record.try_into_unknown()?,
                    repo: session.data.did.into(),
                    rkey: None,
                    swap_commit: None,
                    validate: Some(true),
                }
                .into(),
            )
            .await?;

        println!("Successfully posted: {}", msg.message);
        Ok(())
    }
}

/// Build a hashtag facet by computing the byte offset of the hashtag in the text.
fn build_hashtag_facets(
    text: &str,
    hashtag: &str,
) -> Vec<atrium_api::app::bsky::richtext::facet::Main> {
    let tag_with_hash = if hashtag.starts_with('#') {
        hashtag.to_string()
    } else {
        format!("#{hashtag}")
    };

    // Find the last occurrence of the hashtag in the text
    let Some(byte_offset) = text.rfind(&tag_with_hash) else {
        eprintln!("[Facet] Hashtag {tag_with_hash} not found in text");
        return vec![];
    };

    let byte_start = byte_offset;
    let byte_end = byte_start + tag_with_hash.len();

    // Verify byte boundaries align with char boundaries
    if !text.is_char_boundary(byte_start) || !text.is_char_boundary(byte_end) {
        eprintln!("[Facet] Hashtag byte offsets don't align with char boundaries");
        return vec![];
    }

    let facet = atrium_api::app::bsky::richtext::facet::MainData {
        index: atrium_api::app::bsky::richtext::facet::ByteSliceData {
            byte_start,
            byte_end,
        }
        .into(),
        features: vec![atrium_api::types::Union::Refs(
            atrium_api::app::bsky::richtext::facet::MainFeaturesItem::Tag(
                Box::new(
                    atrium_api::app::bsky::richtext::facet::TagData {
                        tag: tag_with_hash.trim_start_matches('#').to_string(),
                    }
                    .into(),
                ),
            ),
        )],
    }
    .into();

    vec![facet]
}

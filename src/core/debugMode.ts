import { MOON_PHASES, MONTH_NAMES } from './moonPhaseConstants';
import { getPlayfulMoonMessage } from './moonPhaseMessages';

export class DebugMode {
  public async runDebugLoop(): Promise<void> {
    console.log("=== DEBUG MODE: Generating sample messages ===\n");

    for (const month of MONTH_NAMES) {
      const monthIndex = MONTH_NAMES.indexOf(month);
      console.log(`\n--- ${month.toUpperCase()} ---`);
      
      for (const phase of MOON_PHASES) {
        const illumination = Math.random() * 100;
        const { message, hashtag } = getPlayfulMoonMessage(phase, illumination, monthIndex);
        
        const mockPost = {
          text: message,
          facets: [{
            features: [{
              $type: "app.bsky.richtext.facet#tag",
              tag: hashtag.replace('#', '')
            }]
          }]
        };

        console.log(`Phase: ${phase}`);
        console.log(`Message: ${message}`);
        console.log(`Length: ${message.length} characters`);
        console.log(`Mock Post:`, JSON.stringify(mockPost, null, 2));
        console.log('---');
      }
    }
  }
}

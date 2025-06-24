import { 
  MONTH_NAMES, 
  LYCANTHROPIC_PHRASES, 
  BRITISH_REFERENCES, 
  PRIDE_REFERENCES, 
  MONTH_FLAIRS,
  PHASE_CONFIG,
  MESSAGE_CONFIG
} from './moonPhaseConstants';
import { getRandomElement, shuffleArray } from '../utils/arrayUtils';
import type { MoonMessage } from '../types/moonPhase';

export class MoonMessageGenerator {
  private getBaseMessage(phase: string, illumination: number): string {
    const illuminationFixed = illumination.toFixed(1);
    const config = PHASE_CONFIG[phase as keyof typeof PHASE_CONFIG];
    
    if (!config) {
      throw new Error(`Unknown moon phase: ${phase}`);
    }

    const messages = {
      "New Moon": `It's a New Moon, barely a whisper! Illumination: ${illuminationFixed}%.`,
      "Waxing Crescent": `Look up! Waxing Crescent, brighter at ${illuminationFixed}%.`,
      "First Quarter": `Halfway to full! First Quarter moon ${illuminationFixed}% lit.`,
      "Waxing Gibbous": `Waxing Gibbous almost full, glowing at ${illuminationFixed}%!`,
      "Full Moon": `By Jove, a magnificent Full Moon! ${illuminationFixed}% light.`,
      "Waning Gibbous": `Waning Gibbous gracefully fading, ${illuminationFixed}% illuminated.`,
      "Last Quarter": `Last Quarter moon, ${illuminationFixed}% visible!`,
      "Waning Crescent": `Waning Crescent, tiny sliver, ${illuminationFixed}% lit.`
    };

    const baseMessage = messages[phase as keyof typeof messages];
    const lycanthropicPhrase = getRandomElement(LYCANTHROPIC_PHRASES);
    
    return `${config.emoji} ${baseMessage} ${lycanthropicPhrase}`;
  }

  private getAdditionalMessages(monthIndex: number): string[] {
    const currentMonth = MONTH_NAMES[monthIndex];
    const additionalMessages: string[] = [];

    // Add month-specific flair
    if (Math.random() < MESSAGE_CONFIG.MONTH_FLAIR_CHANCE && MONTH_FLAIRS[currentMonth]) {
      additionalMessages.push(getRandomElement(MONTH_FLAIRS[currentMonth]));
    }

    // Add British reference
    if (Math.random() < MESSAGE_CONFIG.BRITISH_REFERENCE_CHANCE) {
      additionalMessages.push(getRandomElement(BRITISH_REFERENCES));
    }

    // Add Pride reference for June
    if (currentMonth === "June" && Math.random() < MESSAGE_CONFIG.PRIDE_REFERENCE_CHANCE_JUNE) {
      additionalMessages.push(getRandomElement(PRIDE_REFERENCES));
    }

    return shuffleArray(additionalMessages);
  }

  private truncateMessage(message: string): string {
    if (message.length <= MESSAGE_CONFIG.MAX_LENGTH) {
      return message;
    }
    
    const truncateLength = MESSAGE_CONFIG.MAX_LENGTH - MESSAGE_CONFIG.TRUNCATE_SUFFIX.length;
    return message.substring(0, truncateLength) + MESSAGE_CONFIG.TRUNCATE_SUFFIX;
  }

  public generateMessage(phase: string, illumination: number, monthIndex: number): MoonMessage {
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error(`Invalid month index: ${monthIndex}. Must be between 0 and 11.`);
    }

    const config = PHASE_CONFIG[phase as keyof typeof PHASE_CONFIG];
    if (!config) {
      throw new Error(`Unknown moon phase: ${phase}`);
    }

    const baseMessage = this.getBaseMessage(phase, illumination);
    const additionalMessages = this.getAdditionalMessages(monthIndex);
    
    const fullMessage = [baseMessage, ...additionalMessages, config.hashtag].join(' ');
    const truncatedMessage = this.truncateMessage(fullMessage);

    return {
      message: truncatedMessage,
      hashtag: config.hashtag
    };
  }
}

export function getPlayfulMoonMessage(
  phase: string, 
  illumination: number, 
  monthIndex: number
): MoonMessage {
  const generator = new MoonMessageGenerator();
  return generator.generateMessage(phase, illumination, monthIndex);
}

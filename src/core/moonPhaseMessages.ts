import { 
  MONTH_NAMES, 
  LYCANTHROPIC_PHRASES, 
  BRITISH_REFERENCES, 
  PRIDE_REFERENCES, 
  MONTH_FLAIRS,
  PHASE_CONFIG,
  MESSAGE_CONFIG,
  PHASE_ALIASES
} from './moonPhaseConstants';
import { getRandomElement, shuffleArray } from '../utils/arrayUtils';
import type { MoonMessage } from '../types/moonPhase';

export class MoonMessageGenerator {
  private normalizePhase(phase: string): string {
    // Check if the phase is already a standard phase
    if (phase in PHASE_CONFIG) {
      return phase;
    }
    
    // Check for direct alias match
    if (phase in PHASE_ALIASES) {
      return PHASE_ALIASES[phase];
    }
    
    // Try case-insensitive matching
    const upperPhase = phase.toUpperCase();
    for (const [alias, standardPhase] of Object.entries(PHASE_ALIASES)) {
      if (alias.toUpperCase() === upperPhase) {
        return standardPhase;
      }
    }
    
    // If no match found, throw error with helpful message
    throw new Error(`Unknown moon phase: "${phase}". Supported phases are: ${Object.keys(PHASE_CONFIG).join(', ')}`);
  }

  private getBaseMessage(phase: string, illumination: number): string {
    const normalizedPhase = this.normalizePhase(phase);
    const illuminationFixed = illumination.toFixed(1);
    const config = PHASE_CONFIG[normalizedPhase as keyof typeof PHASE_CONFIG];

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

    const baseMessage = messages[normalizedPhase as keyof typeof messages];
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

    const normalizedPhase = this.normalizePhase(phase);
    const config = PHASE_CONFIG[normalizedPhase as keyof typeof PHASE_CONFIG];

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
export interface Region {
  usage: {
    en: string;
    es: string;
  };
  notes: {
    en: string;
    es: string;
  };
}

export interface Example {
  spanish: string;
  english: string;
  context: {
    en: string;
    es: string;
  };
}

export interface Phrase {
  id: number;
  phrase: string;
  pronunciation: string;
  date: {
    spanish: string;
    dayName: string;
    monthName: string;
    day: number;
    year: number;
  };
  meaning: {
    en: string;
    es: string;
  };
  context: {
    en: string;
    es: string;
  };
  formality: 'formal' | 'informal' | 'neutral';
  regions: {
    spain: Region;
    latinAmerica: Region;
  };
  examples: Example[];
  similarPhrases: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface Sponsor {
  show: boolean;
  show_after: number;
  headline: {
    en: string;
    es: string;
  };
  image_url: string;
  text: {
    en: string;
    es: string;
  };
  button_text: {
    en: string;
    es: string;
  };
  button_url: string;
}

export interface PhraseData {
  phrases: Phrase[];
  sponsor?: Sponsor;
}
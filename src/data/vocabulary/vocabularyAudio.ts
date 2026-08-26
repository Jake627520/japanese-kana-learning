import { VocabularyItem } from './vocabularyTypes';
import { speakJapanese } from '../../utils/speech';

/**
 * Maps structured vocabulary audioKey to the actual Japanese speech text.
 * Future-proof for multi-clip variants (e.g. slow, pitch accent, shadowing).
 */
export const VOCABULARY_AUDIO_MAPPING: Record<string, string> = {
  vocab_asa: 'あさ',
  vocab_inu: 'いぬ',
  vocab_umi: 'うみ',
  vocab_eki: 'えき',
  vocab_ocha: 'おちゃ',
  vocab_kasa: 'かさ',
  vocab_kinou: 'きのう',
  vocab_kuruma: 'くるま',
  vocab_keisatsu: 'けいさつ',
  vocab_kodomo: 'こども',
  vocab_sakura: 'さくら',
  vocab_shinbun: 'しんぶん',
  vocab_sushi: 'すし',
  vocab_sensei: 'せんせい',
  vocab_sora: 'そら',
  vocab_tamago: 'たまご',
  vocab_chizu: 'ちず',
  vocab_tsukue: 'つくえ',
  vocab_tegami: 'てがみ',
  vocab_tokei: 'とけい',
  vocab_natsu: 'なつ',
  vocab_niku: 'にく',
  vocab_nuno: 'ぬの',
  vocab_neko: 'ねこ',
  vocab_nomimono: 'のみもの',
  vocab_hana: 'はな',
  vocab_hikari: 'ひかり',
  vocab_fune: 'ふね',
  vocab_heya: 'へや',
  vocab_hon: 'ほん',
  vocab_machi: 'まち',
  vocab_mizu: 'みず',
  vocab_mushi: 'むし',
  vocab_me: 'め',
  vocab_mori: 'もり',
  vocab_yama: 'やま',
  vocab_yuki: 'ゆき',
  vocab_yoru: 'よる',
  vocab_raishuu: 'らいしゅう',
  vocab_ringo: 'りんご',
  vocab_rusu: 'るす',
  vocab_rekishi: 'れきし',
  vocab_rousoku: 'ろうそく',
  vocab_watashi: 'わたし',
  vocab_wo: 'を',
  vocab_nihon: 'にほん',
};

/**
 * Play standard audio for a vocabulary item.
 * Transparently delegates through VOICEVOX contentAudioMap with Web Speech fallback.
 */
export function playVocabularyAudio(item: VocabularyItem): void {
  const speechText = VOCABULARY_AUDIO_MAPPING[item.audioKey] || item.word;
  speakJapanese(speechText);
}

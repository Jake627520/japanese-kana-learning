# Asset License Matrix

| Asset Type | Source | License | Attribution Required | Status |
|---|---|---|---|---|
| **Audio (kana + shadowing)** | **VOICEVOX:四国めたん** | VOICEVOX terms — commercial & non-commercial use permitted, redistribution inside an application permitted | **YES — mandatory** | ATTRIBUTED |
| Audio (fallback) | Web Speech API | Native browser speech engine | No | SAFE |
| UI Icons | `lucide-react` | ISC License | Recommended in `THIRD-PARTY-NOTICES.md` | SAFE |
| App Icon | Original SVG (this project) | MIT (same as source) | No | SAFE |
| Typography | System native fonts | OS default | No | SAFE |

## Audio attribution (required)

244 mp3 files ship with this project:

- `public/audio/kana/` — 208 clips, one per kana
- `public/audio/shadowing/` — 36 clips (18 sentences × normal/slow)

All were generated with [VOICEVOX](https://voicevox.hiroshiba.jp/) using the
character **四国めたん**.

The VOICEVOX engine terms permit commercial and non-commercial use, and permit
redistribution inside an application, but require that:

1. **the use of VOICEVOX is credited**, and
2. **each voice library's own terms are followed** — per-character terms are
   independent of the engine terms.

四国めたん's terms require the credit **「VOICEVOX:四国めたん」**.
Full terms: <https://zunko.jp/con_ongen_kiyaku.html>

**Where the credit appears:** site-wide footer, visible on every tab
(`src/App.tsx`).

> ⚠️ Forks that keep these audio files must keep the credit. Regenerating with a
> different character requires updating the credit to that character and
> complying with that character's own terms.

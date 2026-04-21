import { useMemo } from "react";

/**
 * Decorative music-staff divider used by the section eyebrow.
 *
 * - `side="left"`:  staff lines + a randomized opening (clef → key signature → time
 *                   signature) drawn with SMuFL Bravura Text glyphs and Bravura
 *                   engraving conventions, anchored to the left edge of the slot.
 * - `side="right"`: staff lines + a "final" barline (thin stroke + thick stroke)
 *                   drawn with primitives, anchored flush to the right edge.
 *
 * Geometry follows the W3C SMuFL spec for text-based applications:
 *   https://w3c-cg.github.io/smufl/latest/specification/metrics-and-glyph-registration-for-text-based-applications.html
 *   https://w3c-cg.github.io/smufl/latest/tables/barlines.html
 *
 * Reference rendering math (clef baselines, key-signature accidental positions,
 * final-barline geometry) was cross-checked against the Harmonia music-notation
 * engine (https://github.com/PeterYangIO/Harmonia), which is the source of truth
 * for clean, spec-correct SMuFL layout used here.
 *
 * Key invariants:
 *   - 1 staff space = 0.2 em in Bravura **Text** (text-font convention; scoring
 *     fonts use 0.25 em per space, but we are not using a scoring font).
 *   - The 5-line staff occupies 0.8 em of the em square.
 *   - Staff lines are drawn at y = 0.5, 4.5, 8.5, 12.5, 16.5 (centers shifted
 *     down 0.5 svg-px so the 1-svg-px stroke fits inside the viewBox without
 *     clipping at y=0). Anything that needs to align with a line (clef baseline,
 *     barline endpoints, accidental positions) must use these *.5 line-center
 *     coordinates, NOT integer multiples of STAFF_SPACE.
 *   - In Bravura Text, clefsG/clefsC/clefsF are pre-shifted so that placing the
 *     glyph's alphabetic baseline on the bottom-line center yields the
 *     conventional default position for that clef class. Other staff positions
 *     (e.g. tenor C clef) are achieved by shifting the baseline by an integer
 *     number of staff spaces.
 *
 * Final-barline conventions (Bravura `engravingDefaults`, matching Harmonia):
 *   - Thin line: 0.16 staff spaces wide.
 *   - Thick line: 0.5 staff spaces wide, flush with the right edge.
 *   - Gap between thin and thick: 0.4 staff spaces (`barlineSeparation`).
 *   - Both lines span exactly from the top staff line center to the bottom
 *     staff line center (4 staff spaces).
 */

const STAFF_SPACE = 4; // svg-px per staff space
const STAFF_HEIGHT = STAFF_SPACE * 4; // 16
const VIEWBOX_HEIGHT = STAFF_HEIGHT + 1; // +1 for the bottom 1px stroke
const TOP_LINE_Y = 0.5;
const BOTTOM_LINE_Y = STAFF_HEIGHT + 0.5; // 16.5 — center of bottom staff line
const MIDDLE_LINE_Y = (TOP_LINE_Y + BOTTOM_LINE_Y) / 2; // 8.5 — center of middle staff line
const FONT_SIZE = STAFF_SPACE / 0.2; // 20 svg-px (so 0.2 em = 1 staff space)

// ────────────────────────────────────────────────────────────────────────────
// Clefs
// ────────────────────────────────────────────────────────────────────────────

type Clef = {
  name: "treble" | "bass" | "alto" | "tenor";
  /** SMuFL codepoint from the clefs range (U+E050–U+E07F). */
  glyph: string;
  /** SVG y at which to place the glyph's alphabetic baseline. */
  baselineY: number;
  /** Glyph advance width in staff spaces (from Bravura metadata). */
  advanceSp: number;
  /**
   * Clef-class key for accidental positioning. Each clef class has its own
   * conventional set of staff positions for sharps/flats so the accidentals
   * stay within the staff regardless of which clef is in use. The C clef
   * variants additionally shift the positions by the clef's vertical offset
   * (handled at render time via `staffPositionShiftHalfSpaces`).
   */
  signKind: "G" | "F" | "C";
  /**
   * Vertical shift applied to key-signature accidental positions for C clefs,
   * measured in HALF staff spaces. The reference C clef (alto, baselineY at
   * the bottom line) uses 0; the tenor C clef sits one staff space higher,
   * so its accidentals shift up by 2 half-spaces (= 1 staff space).
   */
  staffPositionShiftHalfSpaces: number;
};

const CLEFS: Clef[] = [
  { name: "treble", glyph: "\uE050", baselineY: BOTTOM_LINE_Y, advanceSp: 2.68, signKind: "G", staffPositionShiftHalfSpaces: 0 }, // gClef
  { name: "bass", glyph: "\uE062", baselineY: BOTTOM_LINE_Y, advanceSp: 2.36, signKind: "F", staffPositionShiftHalfSpaces: 0 }, // fClef
  { name: "alto", glyph: "\uE05C", baselineY: BOTTOM_LINE_Y, advanceSp: 2.38, signKind: "C", staffPositionShiftHalfSpaces: 0 }, // cClef (default = alto)
  { name: "tenor", glyph: "\uE05C", baselineY: BOTTOM_LINE_Y - STAFF_SPACE, advanceSp: 2.38, signKind: "C", staffPositionShiftHalfSpaces: -2 }, // cClef shifted up 1 space
];

/**
 * Weighted distribution approximating a typical orchestral score:
 * treble ≈ 54% (winds, upper strings, vocal), bass ≈ 38% (low brass, low
 * strings, low winds), alto ≈ 5% (viola), tenor ≈ 3% (occasional cello,
 * trombone, bassoon — half the rate of alto). Indexes parallel CLEFS above.
 */
const CLEF_WEIGHTS = [20, 14, 2, 1] as const;
const CLEF_WEIGHT_TOTAL = CLEF_WEIGHTS.reduce((a, b) => a + b, 0);

function pickWeightedClef(): Clef {
  let r = Math.random() * CLEF_WEIGHT_TOTAL;
  for (let i = 0; i < CLEFS.length; i++) {
    r -= CLEF_WEIGHTS[i]!;
    if (r < 0) return CLEFS[i]!;
  }
  return CLEFS[0]!; // unreachable, satisfies TS
}

// ────────────────────────────────────────────────────────────────────────────
// Key signatures
// Common subset of Harmonia's KEY_SIG_PALETTE_ITEMS — major keys with up to 4
// sharps or 4 flats. Excludes extreme keys (5/6/7 ♯/♭) and atonal.
// ────────────────────────────────────────────────────────────────────────────

type KeySig = {
  /** Number of sharps (positive) or flats (negative). 0 = C major. */
  fifths: number;
};

const KEY_SIGS: KeySig[] = [
  { fifths: 0 }, // C
  { fifths: 1 }, // G
  { fifths: 2 }, // D
  { fifths: 3 }, // A
  { fifths: 4 }, // E
  { fifths: -1 }, // F
  { fifths: -2 }, // Bb
  { fifths: -3 }, // Eb
  { fifths: -4 }, // Ab
];

/**
 * Vertical positions of the accidentals in a key signature, per clef class,
 * in HALF staff spaces measured downward from the top staff line. Order
 * matches the traditional sharp / flat ordering (FCGDAEB / BEADGCF).
 *
 * Verbatim from Harmonia's `render_signatures.rs` (`render_key_signature`),
 * which tunes positions per clef so the accidentals stay within the staff.
 * For C clefs, the *additional* shift for non-default C clef positions (e.g.
 * tenor) is applied at render time via `Clef.staffPositionShiftHalfSpaces`.
 */
const KEY_SIG_POSITIONS_BY_CLEF: Record<"G" | "F" | "C", { sharps: number[]; flats: number[] }> = {
  G: {
    sharps: [0.0, 3.0, -0.5, 2.5, 5.5, 1.5, 4.5],
    flats: [4.0, 1.0, 4.5, 1.5, 5.0, 2.0, 5.5],
  },
  F: {
    sharps: [2.0, 5.0, 1.5, 4.5, 7.5, 3.5, 6.5],
    flats: [6.0, 3.0, 6.5, 3.5, 7.0, 4.0, 7.5],
  },
  C: {
    sharps: [1.0, 4.0, 0.5, 3.5, 6.5, 2.5, 5.5],
    flats: [5.0, 2.0, 5.5, 2.5, 6.0, 3.0, 6.5],
  },
};

const SHARP_GLYPH = "\uE262"; // SMuFL accidentalSharp
const FLAT_GLYPH = "\uE260"; // SMuFL accidentalFlat
const ACCIDENTAL_STEP_SP = 1.1; // horizontal advance per accidental (Harmonia)
const ACCIDENTAL_LEADING_PAD_SP = 0.5; // gap before the first accidental, internal to the key sig (Harmonia render_key_signature: `let x_cur = x + 0.5*sp`)
// Harmonia's value is 1.0 sp; reduced to 0.3 sp because in this ornament the
// time signature sits immediately after the key sig with nothing further to
// the right (no notes). Harmonia's larger trailing pad is tuned for full
// measures where the first note follows; here it just creates a visual gap
// that makes the key sig look pushed left toward the clef.
const ACCIDENTAL_TRAILING_PAD_SP = 0.3;

// ────────────────────────────────────────────────────────────────────────────
// Time signatures
// Common subset of Harmonia's TIME_SIG_PALETTE_ITEMS.
// ────────────────────────────────────────────────────────────────────────────

type TimeSig =
  | { kind: "fraction"; count: number; unit: number }
  | { kind: "common" }
  | { kind: "cut" };

const TIME_SIGS: TimeSig[] = [
  { kind: "fraction", count: 4, unit: 4 },
  { kind: "fraction", count: 3, unit: 4 },
  { kind: "fraction", count: 2, unit: 4 },
  { kind: "fraction", count: 6, unit: 8 },
  { kind: "fraction", count: 9, unit: 8 },
  { kind: "fraction", count: 12, unit: 8 },
  { kind: "fraction", count: 3, unit: 8 },
  { kind: "common" },
  { kind: "cut" },
];

// SMuFL time-signature digit glyphs (U+E080–U+E089).
const TIME_SIG_DIGITS = [
  "\uE080", "\uE081", "\uE082", "\uE083", "\uE084",
  "\uE085", "\uE086", "\uE087", "\uE088", "\uE089",
];
const TIME_SIG_COMMON = "\uE08A";
const TIME_SIG_CUT = "\uE08B";
const TIME_SIG_DIGIT_STEP_SP = 1.2; // per-digit advance for stacked numerals (Harmonia render_signatures.rs)
const TIME_SIG_LEADING_PAD_SP = 0.5; // gap before the first digit, internal to the time sig (Harmonia render_time_signature: `let center_x = x + 0.5*sp + max_width*0.5`)

// ────────────────────────────────────────────────────────────────────────────
// Layout
// ────────────────────────────────────────────────────────────────────────────

const OPENING_LEFT_PAD_SP = 0.5; // breathing room so clef glyphs don't hug the left edge
/**
 * Gaps in staff spaces, matched to Harmonia's `render_measure.rs` layout sequence:
 *   render_clef(x_cursor + 0.5sp);   x_cursor += 3.0sp;             // clef slot
 *   x_cursor = render_key_signature(x_cursor, ...);                  // adds 0.5sp lead, 1.1sp step, returns +1.0sp trail
 *   render_time_signature(x_cursor + 0.3sp, ...);                    // 0.3sp gap, then 0.5sp internal lead
 *
 * Composed: clef glyph origin → keysig start = clef advance + this gap;
 * keysig end (after trailing) → time sig glyph = TIMESIG_LEADING_GAP_SP + 0.5sp internal.
 */
// Harmonia's value is 0.5 sp; bumped to 0.7 sp so the key signature has
// matching breathing room on its left side as it does on its right (after
// the trailing-pad reduction above). This optically centers the key sig
// between the clef and the time sig.
const CLEF_TO_KEYSIG_GAP_SP = 0.7;
const TIMESIG_LEADING_GAP_SP = 0.2; // gap before time sig (Harmonia uses 0.3 sp; tightened slightly to balance the now-tighter clef→keysig gap)

/**
 * ViewBox width of the opening ornament (clef + key sig + time sig).
 * Sized to comfortably fit the widest combination (4 accidentals + 2-digit
 * time signature) while still anchoring to the left edge via
 * `preserveAspectRatio="xMinYMid meet"`.
 */
const OPENING_BOX_WIDTH = 60;

/**
 * Final-barline geometry, from Bravura `engravingDefaults`.
 * Matches Harmonia's `render_barlines.rs` exactly.
 */
const BARLINE_THIN = 0.16 * STAFF_SPACE; // 0.64
const BARLINE_THICK = 0.5 * STAFF_SPACE; // 2
const BARLINE_GAP = 0.4 * STAFF_SPACE; // 1.6 (`barlineSeparation`)
const BARLINE_BOX_WIDTH = BARLINE_THIN + BARLINE_GAP + BARLINE_THICK;
const BARLINE_LINE_HEIGHT = BOTTOM_LINE_Y - TOP_LINE_Y; // 16 (4 staff spaces)

/**
 * Staff line thickness in viewBox units. Bravura's engravingDefaults specify
 * `staffLineThickness: 0.13` sp; we use 0.16 sp instead so the lines match
 * the weight of the thin final-barline stroke (also 0.16 sp) and read as a
 * cohesive system. Expressed in viewBox units (not device pixels) so the
 * thickness scales with `--staff-space` like every other element. Avoid
 * `vector-effect="non-scaling-stroke"` here — that would lock thickness to
 * a fixed device-pixel value and defeat the proportional-scaling design.
 */
const STAFF_LINE_THICKNESS = 0.16 * STAFF_SPACE; // 0.64

// ────────────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────────────

type Props = {
  /** Which side of the eyebrow text the divider sits on. */
  side: "left" | "right";
};

function StaffLines() {
  return (
    <svg
      className="staff-divider__lines"
      role="presentation"
      preserveAspectRatio="none"
      viewBox={`0 0 100 ${VIEWBOX_HEIGHT}`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const y = i * STAFF_SPACE + 0.5;
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeWidth={STAFF_LINE_THICKNESS}
          />
        );
      })}
    </svg>
  );
}

/**
 * Renders a stacked time-signature fraction (e.g., 4/4, 6/8, 12/8) starting at
 * the given x. Numerator and denominator are independently centered on each
 * other so a 12/4 (numerator wider than denominator) still looks balanced.
 *
 * Mirrors Harmonia's `render_time_signature`: digits are left-anchored at
 * `x + 0.5sp + (max_width - row_width)/2 + i*1.2sp`, with the row spanning
 * `max(num_digits, den_digits) * 1.2sp` of horizontal space.
 *
 * Returns the total width consumed (in svg-px) including the leading pad.
 */
function renderTimeSigFraction(timeSig: { count: number; unit: number }, x: number) {
  const numerator = String(timeSig.count);
  const denominator = String(timeSig.unit);
  const step = TIME_SIG_DIGIT_STEP_SP * STAFF_SPACE;
  const leadingPad = TIME_SIG_LEADING_PAD_SP * STAFF_SPACE;
  const numWidth = numerator.length * step;
  const denWidth = denominator.length * step;
  const maxWidth = Math.max(numWidth, denWidth);

  // SMuFL time-signature digits are designed so that placing the glyph's
  // ALPHABETIC baseline on a staff line center makes the digit (bbox ≈ ±1sp
  // around baseline) span exactly the two staff spaces flanking that line —
  // i.e. the digit visually centers in the half-staff. Numerator → line 2
  // (top half), denominator → line 4 (bottom half). Matches Harmonia's
  // `staff_y + 1.0*sp` (numerator) and `staff_y + 3.0*sp` (denominator).
  const numeratorY = TOP_LINE_Y + STAFF_SPACE; // 4.5 (line 2 center)
  const denominatorY = TOP_LINE_Y + 3 * STAFF_SPACE; // 12.5 (line 4 center)

  const renderRow = (digits: string, y: number) => {
    const rowWidth = digits.length * step;
    const rowOffset = (maxWidth - rowWidth) / 2;
    return digits.split("").map((d, i) => (
      <text
        key={`${y}-${i}`}
        x={x + leadingPad + rowOffset + i * step}
        y={y}
        fontFamily='"Bravura Text", serif'
        fontSize={FONT_SIZE}
        textAnchor="start"
        dominantBaseline="alphabetic"
        fill="currentColor"
      >
        {TIME_SIG_DIGITS[Number(d)]}
      </text>
    ));
  };

  return {
    width: leadingPad + maxWidth,
    nodes: (
      <>
        {renderRow(numerator, numeratorY)}
        {renderRow(denominator, denominatorY)}
      </>
    ),
  };
}

function OpeningOrnament() {
  // Pick a random clef, key sig, and time sig once per component instance.
  const clef = useMemo(() => pickWeightedClef(), []);
  const keySig = useMemo(() => KEY_SIGS[Math.floor(Math.random() * KEY_SIGS.length)]!, []);
  const timeSig = useMemo(() => TIME_SIGS[Math.floor(Math.random() * TIME_SIGS.length)]!, []);

  // Layout in svg-px, advancing left-to-right (mirrors Harmonia's
  // `render_measure.rs` call sequence with explicit leading pads):
  //   clef glyph at clefX (left-anchored)
  //   keysig starts at clefX + clef.advanceSp + CLEF_TO_KEYSIG_GAP_SP
  //     first accidental left-edge at keySigX + 0.5sp (internal leading pad)
  //     N accidentals at 1.1sp step, then 1.0sp internal trailing pad
  //   time sig glyph at keySigEnd + 0.3sp (caller-applied gap)
  //     first digit left-edge at timeSigX + 0.5sp (internal leading pad)
  const clefX = OPENING_LEFT_PAD_SP * STAFF_SPACE;
  const keySigX = clefX + (clef.advanceSp + CLEF_TO_KEYSIG_GAP_SP) * STAFF_SPACE;

  const accidentalCount = Math.abs(keySig.fifths);
  const accidentalGlyph = keySig.fifths > 0 ? SHARP_GLYPH : FLAT_GLYPH;
  const clefPositions = KEY_SIG_POSITIONS_BY_CLEF[clef.signKind];
  const accidentalBasePositions = keySig.fifths > 0 ? clefPositions.sharps : clefPositions.flats;
  const accidentalStep = ACCIDENTAL_STEP_SP * STAFF_SPACE;
  const accidentalLeadingPad = ACCIDENTAL_LEADING_PAD_SP * STAFF_SPACE;
  const accidentalTrailingPad = ACCIDENTAL_TRAILING_PAD_SP * STAFF_SPACE;

  // Distance consumed by the key signature itself (0 if no accidentals).
  const keySigConsumed =
    accidentalCount > 0
      ? accidentalLeadingPad + accidentalCount * accidentalStep + accidentalTrailingPad
      : 0;

  const timeSigX = keySigX + keySigConsumed + TIMESIG_LEADING_GAP_SP * STAFF_SPACE;

  return (
    <svg
      className="staff-divider__ornament"
      role="presentation"
      preserveAspectRatio="xMinYMid meet"
      viewBox={`0 0 ${OPENING_BOX_WIDTH} ${VIEWBOX_HEIGHT}`}
    >
      {/* Clef */}
      <text
        x={clefX}
        y={clef.baselineY}
        fontFamily='"Bravura Text", serif'
        fontSize={FONT_SIZE}
        textAnchor="start"
        dominantBaseline="alphabetic"
        fill="currentColor"
      >
        {clef.glyph}
      </text>

      {/* Key signature accidentals — left-anchored at keySigX + 0.5sp + i*1.1sp,
          matching Harmonia's render_key_signature. Positions are clef-aware
          (treble/bass/C tables); tenor C clef adds a per-clef vertical shift. */}
      {Array.from({ length: accidentalCount }, (_, i) => {
        const x = keySigX + accidentalLeadingPad + i * accidentalStep;
        const positionHalfSpaces = accidentalBasePositions[i]! + clef.staffPositionShiftHalfSpaces;
        const y = TOP_LINE_Y + positionHalfSpaces * STAFF_SPACE * 0.5;
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontFamily='"Bravura Text", serif'
            fontSize={FONT_SIZE}
            textAnchor="start"
            dominantBaseline="central"
            fill="currentColor"
          >
            {accidentalGlyph}
          </text>
        );
      })}

      {/* Time signature: common/cut symbols span the full staff (bbox ≈ ±1.5sp
          around baseline). Place alphabetic baseline at the middle line so the
          glyph centers vertically on the staff. Use the same 0.5sp internal
          leading pad as the fraction renderer. */}
      {timeSig.kind === "common" || timeSig.kind === "cut" ? (
        <text
          x={timeSigX + TIME_SIG_LEADING_PAD_SP * STAFF_SPACE}
          y={MIDDLE_LINE_Y}
          fontFamily='"Bravura Text", serif'
          fontSize={FONT_SIZE}
          textAnchor="start"
          dominantBaseline="alphabetic"
          fill="currentColor"
        >
          {timeSig.kind === "common" ? TIME_SIG_COMMON : TIME_SIG_CUT}
        </text>
      ) : (
        renderTimeSigFraction(timeSig, timeSigX).nodes
      )}
    </svg>
  );
}

function FinalBarlineOrnament() {
  // Draw the thick line flush right, then the thin line one gap to its left.
  const thickX = BARLINE_BOX_WIDTH - BARLINE_THICK;
  const thinX = thickX - BARLINE_GAP - BARLINE_THIN;
  return (
    <svg
      className="staff-divider__ornament"
      role="presentation"
      preserveAspectRatio="xMaxYMid meet"
      viewBox={`0 0 ${BARLINE_BOX_WIDTH} ${VIEWBOX_HEIGHT}`}
    >
      <rect x={thinX} y={TOP_LINE_Y} width={BARLINE_THIN} height={BARLINE_LINE_HEIGHT} fill="currentColor" />
      <rect x={thickX} y={TOP_LINE_Y} width={BARLINE_THICK} height={BARLINE_LINE_HEIGHT} fill="currentColor" />
    </svg>
  );
}

export function StaffDivider({ side }: Props) {
  return (
    <span className="staff-divider" data-side={side} aria-hidden="true">
      <StaffLines />
      {side === "left" ? <OpeningOrnament /> : <FinalBarlineOrnament />}
    </span>
  );
}

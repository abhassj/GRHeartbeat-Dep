import classWhiteboard800 from '@/assets/photos/cpr-class-whiteboard-800.webp'
import classWhiteboard1200 from '@/assets/photos/cpr-class-whiteboard-1200.webp'
import compressions800 from '@/assets/photos/cpr-compressions-manikin-800.webp'
import compressions1200 from '@/assets/photos/cpr-compressions-manikin-1200.webp'
import firstAidKit800 from '@/assets/photos/first-aid-kit-800.webp'
import firstAidKit1200 from '@/assets/photos/first-aid-kit-1200.webp'

/*
 * Photos, referenced elsewhere in src/data by id (so data files stay importable by the
 * Node content check). All three are PLACEHOLDERS taken from the old site and appear to be
 * stock photography — see src/assets/photos/MANIFEST.md.
 * TODO(client): supply real training photos (and confirm we may use any we keep).
 * Originals are 1200px wide, so 1200w is the largest size (no upscaling).
 */
const photo = (small, large, width, height, alt) => ({
  src: large,
  srcSet: `${small} 800w, ${large} 1200w`,
  width,
  height,
  alt,
  placeholder: true,
})

export const photos = {
  cprCompressions: photo(
    compressions800,
    compressions1200,
    1200,
    1200,
    'Close-up of hands in blue gloves giving chest compressions to a CPR training manikin',
  ),
  cprClass: photo(
    classWhiteboard800,
    classWhiteboard1200,
    1200,
    1200,
    'A trainee checks a CPR manikin for breathing while an instructor points to the steps on a whiteboard',
  ),
  firstAidKit: photo(
    firstAidKit800,
    firstAidKit1200,
    1200,
    675,
    'An open red first aid kit with bandages, gloves, scissors and masks laid out on a white surface',
  ),
}

export const getPhoto = (id) => (id ? (photos[id] ?? null) : null)

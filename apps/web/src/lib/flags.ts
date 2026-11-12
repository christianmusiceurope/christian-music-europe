/**
 * Newsletter signup is hidden until PUBLIC_CME_NEWSLETTER=true.
 * Leave the flag unset (or any value other than true) so the header
 * button and the bottom band stay off until CME is ready to launch them.
 */
export const newsletterEnabled = import.meta.env.PUBLIC_CME_NEWSLETTER === 'true';

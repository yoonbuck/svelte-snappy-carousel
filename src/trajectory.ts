/**
 * @param damping
 * damping/deceleration constant used to calculate intended landing trajectory
 * 0 < damping <= 1
 * closer to 1 = landing closer to current position
 * closer to 0 = landing further from current position
 *
 * in (proportion of velocity lost)/second
 * */
export function makeTrajectory(damping: number) {
  const factor = -1 / Math.log(1 - damping);
  return (velocity: number) => velocity * factor;
}

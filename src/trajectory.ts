/**
 * Gets landing point from a user fling with a quadratic ramp down.
 *
 * Velocity should be normalized to units of (distance) / (ramp down duration);
 * so if you have (distance traveled) and (time delta), velocity is calculated
 * as (distance traveled) * (intended ramp down duration) / (time delta).
 *
 * @param position initial position
 * @param velocity initial velocity (note units)
 * @param damping actual quadratic damping will probably take you further than
 *    intended, so this damping constant (>1) is used to divide the result.
 *
 * @returns landing position
 */
export function getTarget(
  position: number,
  velocity: number,
  damping = 4
): number {
  return position + (2 * velocity) / damping;
}

/**
 * Creates a cubic trajectory given a user fling, with cubic ramp down.
 * The curve has the given initial position and velocity, and will land
 * at time t = 1 with velocity 0 at the given target position.
 *
 * Velocity should be normalized to units of (distance) / (ramp down duration);
 * so if you have (distance traveled) and (time delta), velocity is calculated
 * as (distance traveled) * (intended ramp down duration) / (time delta).
 *
 * Interpolate t linearly from 0 to 1 over your chosen ramp down duration
 *
 * @param position initial position
 * @param target target position
 * @param velocity initial velocity (note units)
 *
 * @returns an interpolation function (t: 0 - 1) -> (position)
 */
export function getTrajectory(
  position: number,
  target: number,
  velocity: number
): (t: number) => number {
  console.log("making trajectory:", { position, target, velocity });
  target -= position;
  const a = velocity - 2 * target;
  const b = 3 * target - 2 * velocity;
  const c = velocity;
  return function (t: number) {
    return a * t * t * t + b * t * t + c * t + position;
  };
}

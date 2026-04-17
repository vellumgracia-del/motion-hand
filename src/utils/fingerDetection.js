/**
 * Counts the number of raised fingers based on MediaPipe hand landmarks.
 * @param {Array} landmarks - The array of 21 landmark points from MediaPipe Hands.
 * @returns {number} The count of raised fingers.
 */
export function countFingers(landmarks) {
  if (!landmarks || landmarks.length === 0) return 0;
  
  const tips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky tips
  const pips = [6, 10, 14, 18]; // Index, Middle, Ring, Pinky middle joints
  let count = 0;

  // Thumb Logic
  // Assuming right hand for simplistic calculation; for full robustness 
  // you'd check handedness from MediaPipe results. 
  // As the canvas is mirrored horizontally, we check x coordinates.
  // Note: if x coord of tip is smaller than x coord of IP joint (mirrored) -> thumb is out.
  if (landmarks[4].x < landmarks[3].x) { 
      count++; 
  }

  // Other 4 fingers (Index to Pinky)
  // Determine if the tip is "higher" (lower y value) than the PIP joint.
  tips.forEach((tip, index) => {
      if (landmarks[tip].y < landmarks[pips[index]].y) {
          count++;
      }
  });

  return count;
}

/**
* Linearly interpolates between two numbers.
* @param {number} start - Start value
* @param {number} end - End value
* @param {number} amt - Interpolation factor (0.0 to 1.0)
* @returns {number} Interpolated value
*/
export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export async function setLightValues(brightness: Number, colorTemperature: String) {
  // This mock API returns the requested lighting values
  return {
    brightness,
    colorTemperature,
  };
}

export function setIsLocked(isLocked: Boolean) {
  return {
    isLocked,
  };
}

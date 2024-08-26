export async function setLightValues(brightness: number, colorTemperature: string) {
  // This mock API returns the requested lighting values
  return {
    brightness,
    colorTemperature,
  };
}

export function setIsLocked(isLocked: boolean) {
  return {
    isLocked,
  };
}

import { lockAndUnlockCarFunctionDeclaration } from "./vehicle";
import { getDateFunctionDeclaration } from "./dateTime";
import {
  getCurrentLocationDeclaration,
  getLocationNameFromCordinatesDeclaration,
} from "./location";
import {
  getWeatherDeclaration,
  getWeatherForecastDeclaration,
} from "./weather";
import { controlLightFunctionDeclaration } from "./smartHome";

export function getFunctionDeclarations(): any[] {
  return [
    getCurrentLocationDeclaration,
    getDateFunctionDeclaration,
    getLocationNameFromCordinatesDeclaration,
    getWeatherForecastDeclaration,
    lockAndUnlockCarFunctionDeclaration,
    controlLightFunctionDeclaration,
    getWeatherDeclaration,
  ];
}

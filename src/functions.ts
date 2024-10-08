import { FunctionCall, FunctionResponse, FunctionResponsePart } from "@google/generative-ai";
import { coordinateToName, getLocation } from "./location";
import { setIsLocked, setLightValues } from "./smartHome";
import { getLocalWeather, getLocalWeatherForecast } from "./weather";

const functions = {
  controlLight: ({ brightness, colorTemperature } : {brightness: number, colorTemperature: string}) => {
    return setLightValues(brightness, colorTemperature);
  },
  getCurrentLocation: () => {
    return getLocation();
  },
  getLocationNameFromCordinates: async ({ latitude, longitude } : {latitude: string, longitude: string}) => {
    return await coordinateToName({ longitude, latitude });
  },
  controlCarLocks: ({ isLocked } : {isLocked: boolean}) => {
    return setIsLocked(isLocked);
  },
  getDateAndTime: () => {
    const date = new Date();
    const datevalues = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hour: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
    return datevalues;
  },
  getWeather: async () => {
    return await getLocalWeather();
  },
  getWeatherForecast: async (days: number) => {
    return await getLocalWeatherForecast(days);
  },
};

export async function handleFunctionCalls(
  calls: FunctionCall[],
): Promise<FunctionResponsePart[]> {
  const data: FunctionResponse[] = new Array();
  // TODO: Should probably use Promise.all() instead.
  for (let i = 0; i < calls.length; i++) {
    const call = calls[i];
    if(!call) {
      continue;
    }
    //@ts-ignore
    const apiResponse = await functions[call.name](call.args);
    data.push({
      name: call.name,
      response: apiResponse,
    });
  }

  const parts = data.map(
    ({ name, response }): FunctionResponsePart => ({
      functionResponse: {
        name,
        response: {
          content: response,
        },
      },
    }),
  );

  return parts;
}

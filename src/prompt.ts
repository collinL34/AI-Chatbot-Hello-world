import dotenv from "dotenv";
import { GoogleGenerativeAI, FunctionResponse, FunctionResponsePart } from "@google/generative-ai";
import readline from "readline";

const findPlace = (place) => {
  const tomTomApiKey = process.env.TOM_TOM_API_KEY;
  const url = `https://api.tomtom.com/search/2/search/${place}.json?key=${tomTomApiKey}`;

  fetch(url)
    .then((response) => response.text())
    .then((body) => {
      console.log(JSON.stringify(body));
    });
};

async function coordinateToName({ longitude, latitude }) {
  const tomTomApiKey = process.env.TOM_TOM_API_KEY;
  const url = `https://api.tomtom.com/search/2/geocode/${latitude},${longitude}.json?key=${tomTomApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.text();
    // console.log('data: ', JSON.stringify(data));
    return JSON.stringify(data);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

function getLocation() {
  return {
    latitude: "45.515050",
    longitude: "-122.648590",
    city: "Portland",
    state: "Oregon",
    county: "Multnomah",
  };
}

const routeToDestination = (destination) => {
  const currentLocation = getLocation();
  const tomTomApiKey = process.env.TOM_TOM_API_KEY;
};

async function getLocalWeather() {
  const current = getLocation();
  const url = `http://api.weatherapi.com/v1/current.json?q=${current.latitude},${current.longitude}&key=${process.env.WEATHER_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const weather = data.current;

    return {
      location: data.location,
      ...weather,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

async function getLocalWeatherForecast(days) {
  const current = getLocation();
  const url = `http://api.weatherapi.com/v1/forecast.json?q=${current.latitude},${current.longitude}&key=${process.env.WEATHER_API_KEY}&days=${days}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const forecast = data.forecast.forecastday;

    return {
      ...forecast,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

dotenv.config();

const systemMessage =
  "You are a happy, loving and slightly sassy assitant. " +
  "You will help people and use lots of emoticons. " +
  "Dont be overly verbose or too sappy. ";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startPrompt() {
  async function setLightValues(brightness, colorTemperature) {
    // This mock API returns the requested lighting values
    return {
      brightness,
      colorTemperature,
    };
  }

  function setIsLocked(isLocked) {
    return {
      isLocked,
    };
  }

  const lockAndUnlockCarFunctionDeclaration = {
    name: "controlCarLocks",
    description: "Lock and unlock your car remotely",
    parameters: {
      type: "OBJECT",
      description: "Lock and unlock car",
      properties: {
        isLocked: {
          type: "BOOLEAN",
          description:
            "False and the car is unlocked and true the car is locked",
        },
      },
      required: ["isLocked"],
    },
  };

  const getDateFunctionDeclaration = {
    name: "getDateAndTime",
    description:
      "Returns the current date and time, day, month, year, minutes, and seconds",
  };

  const controlLightFunctionDeclaration = {
    name: "controlLight",
    description: "Turn on and off smartlight",
    parameters: {
      type: "OBJECT",
      description: "Set the brightness and color temperature of a room light.",
      properties: {
        brightness: {
          type: "NUMBER",
          description:
            "Light level from 0 to 100. Zero is off and 100 is full brightness.",
        },
        colorTemperature: {
          type: "STRING",
          description:
            "Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.",
        },
      },
      required: ["brightness", "colorTemperature"],
    },
  };

  const getLocationNameFromCordinatesDeclaration = {
    name: "getLocationNameFromCordinates",
    description:
      "fetch the name of the location from it's latitude and longitude",
    parameters: {
      type: "OBJECT",
      description: "Set the longitude and latitude to lookup the name for",
      properties: {
        latitude: {
          type: "STRING",
          description: "The latitude",
        },
        longitude: {
          type: "STRING",
          description: "the longitude",
        },
      },
      required: ["latitude", "longitude"],
    },
  };

  const getCurrentLocationDeclaration = {
    name: "getCurrentLocation",
    description: "Fetch the current location of the user",
  };

  const getWeatherDeclaration = {
    name: "getWeather",
    description: "Fetch the current weather for the current location",
  };

  const getWeatherForecastDeclaration = {
    name: "getWeatherForecast",
    description: "Fetch the weather forecast for the current location",
  };

  // Executable function code. Put it in a map keyed by the function name
  // so that you can call it once you get the name string from the model.
  const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
      return setLightValues(brightness, colorTemperature);
    },
    getCurrentLocation: () => {
      return getLocation();
    },
    getLocationNameFromCordinates: async ({ latitude, longitude }) => {
      return await coordinateToName({ longitude, latitude });
    },
    controlCarLocks: ({ isLocked }) => {
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
    getWeatherForecast: async (days) => {
      return await getLocalWeatherForecast(days);
    },
  };

  let metadata = {
    functionDeclarations: [
      getCurrentLocationDeclaration,
      getDateFunctionDeclaration,
      getLocationNameFromCordinatesDeclaration,
      getWeatherForecastDeclaration,
      lockAndUnlockCarFunctionDeclaration,
      controlLightFunctionDeclaration,
      getWeatherDeclaration
    ],
  };

  const tools = [metadata];

  const genAI = new GoogleGenerativeAI(process.env.API_KEY || "Invalid");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools,
  });

  const chat = model.startChat();

  const res = await chat.sendMessage([
    "Were starting a chat conversation",
    systemMessage,
  ]);

  console.log(res.response.text());

  rl.on("line", async (prompt) => {
    const result = await chat.sendMessage([prompt, systemMessage]);
    const calls = result.response.functionCalls();

    if (calls) {
      const data: FunctionResponse[] = new Array();
      // TODO: Should probably use Promise.all() instead.
      for (var i = 0; i < calls.length; i++) {
        const call = calls[i];
        console.log("Calling: ", call.name);
        const apiResponse = await functions[call.name](call.args);
        data.push(
          {
            name: call.name,
            response: apiResponse,
          },
        );
      }


      const parts = data.map(
        ({ name, response }): FunctionResponsePart => ({
          functionResponse: {
            name,
            response: {
              content: response,
            },
          },
        })
      )

      // Send the API response back to the model so it can generate
      // a text response that can be displayed to the user.
      const result2 = await chat.sendMessage([...parts]);

      console.log(result2.response.text());

      rl.prompt();
    } else {
      console.log(result.response.text());
      rl.prompt();
    }
  }).on("close", async () => {
    const result = await chat.sendMessage([
      "Okay im leaving now, bye!",
      systemMessage,
    ]);

    const bye = result.response.text();

    console.log(bye);
    process.exit(0);
  });
}

startPrompt().then(() => {});

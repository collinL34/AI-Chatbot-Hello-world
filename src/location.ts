export function getLocation() {
  return {
    latitude: "45.515050",
    longitude: "-122.648590",
    city: "Portland",
    state: "Oregon",
    county: "Multnomah",
  };
}

export const getLocationNameFromCordinatesDeclaration = {
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

export const findPlace = (place) => {
  const tomTomApiKey = process.env.TOM_TOM_API_KEY;
  const url = `https://api.tomtom.com/search/2/search/${place}.json?key=${tomTomApiKey}`;

  fetch(url)
    .then((response) => response.text())
    .then((body) => {
      console.log(JSON.stringify(body));
    });
};

export async function coordinateToName({ longitude, latitude }) {
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

export const routeToDestination = (destination) => {
  const currentLocation = getLocation();
  const tomTomApiKey = process.env.TOM_TOM_API_KEY;
};

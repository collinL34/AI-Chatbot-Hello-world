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

export const getCurrentLocationDeclaration = {
  name: "getCurrentLocation",
  description: "Fetch the current location of the user",
};

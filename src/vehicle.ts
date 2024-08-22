export const lockAndUnlockCarFunctionDeclaration = {
  name: "controlCarLocks",
  description: "Lock and unlock your car remotely",
  parameters: {
    type: "OBJECT",
    description: "Lock and unlock car",
    properties: {
      isLocked: {
        type: "BOOLEAN",
        description: "False and the car is unlocked and true the car is locked",
      },
    },
    required: ["isLocked"],
  },
};

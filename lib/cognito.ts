import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export async function confirmSignUp(username: string, code: string) {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    Username: username,
    ConfirmationCode: code,
  });

  return await client.send(command);
}

export async function signUp(
  username: string,
  password: string,
  name: string,
  email: string,
  phoneNumber: string
) {
  const command = new SignUpCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "name",
        Value: name,
      },
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "phone_number",
        Value: phoneNumber, // e.g., "+14055551234"
      },
    ],
  });
  const response = await client.send(command);

  return response;
}

export async function globalSignOut() {
  const accessToken = localStorage.getItem("cognito_access_token");
  if (!accessToken) {
    console.error("No access token found, user may not be signed in.");
    return;
  }

  const command = new GlobalSignOutCommand({
    AccessToken: accessToken,
  });

  try {
    await client.send(command);
    localStorage.removeItem("cognito_id_token");
    localStorage.removeItem("cognito_access_token");
    localStorage.removeItem("cognito_refresh_token");

    console.log("User globally signed out");
  } catch (err) {
    console.error("Error during global sign out:", err);
  }
}

export async function updatePassword({
  session,
  username,
  newPassword,
  name = "Dheeraj",
}: {
  session: string;
  username: string;
  newPassword: string;
  name?: string;
}) {
  try {
    const command = new RespondToAuthChallengeCommand({
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      Session: session!,
      ChallengeResponses: {
        USERNAME: username!,
        NEW_PASSWORD: newPassword,
        name: name, // required attribute
        phone_number: "4054004847",
      },
    });

    const response = await client.send(command);

    return response;
  } catch (err) {
    console.error("Error setting new password:", err);
  }
}

//AWS Signin Function with cognito SDK
export async function signIn(username: string, password: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  });

  const response = await client.send(command);

  const authResult = response.AuthenticationResult;
  if (authResult) {
    localStorage.setItem("cognito_id_token", authResult.IdToken!);
    localStorage.setItem("cognito_access_token", authResult.AccessToken!);
    localStorage.setItem("cognito_refresh_token", authResult.RefreshToken!);
  }

  return response;
}

export async function getUserData() {
  try {
    const command = new GetUserCommand({
      AccessToken: localStorage.getItem("cognito_access_token")!,
    });
    const response = await client.send(command);
    return response;
  } catch (e) {
    console.log(e);
  }
}

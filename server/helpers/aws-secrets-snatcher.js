import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

async function envExampleParser() {
    const file = await fs.readFile('./.env_example', 'utf8');
    const lines = file.split(/\s/);
    const linesWithData = lines.filter(line => !!line);
    const keys = linesWithData.map(line => line.split('=')[0]);

    return keys;
}

// envExampleParser();

function getAwsSecret(key) {
    const client = new SecretsManagerClient({
        region: "us-east-2",
    });

    let response;

    try {
        response = client.send(
            new GetSecretValueCommand({
                SecretId: key,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    const result = `${key}=${response.SecretString}`;

    console.log(response);
    console.log(result);

    return result;
}

export default async function snatchSecrets() {
    // check if .env exists, or if the secrets needed for the application exist
    // (DB PASS, DB USER, ETC)
    const envExists = existsSync('./.env');

    // if so, do nothing
    if (envExists) {
        return;
    }

    // else, create .env, grab secrets from secrets manager
    const keys = envExampleParser();
    const promises = [];
    let results = [];

    for (let i = 0; i < keys.length; i++) {
        promises.push(getAwsSecret(keys[i]));
    }

    await Promise.all(promises).then(responses => {
        results = responses;
    });

    const envData = results.join('\n');

    fs.writeFile('./.env', envData);
}

snatchSecrets();

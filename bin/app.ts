#!/usr/bin/env node
import "dotenv/config";
import "source-map-support/register";
import { App } from "aws-cdk-lib";

import { readdirSync } from "fs";

const app = new App();

const env = {
  region: process.env.AWS_REGION,
  account: process.env.AWS_ACCOUNT_ID,
};

// const resources = new ResourceStack(app, "ResourceStack", {env});

const serviceOrg = "@sample-org";

const initServices = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isSymbolicLink())
    .map((dirent) => dirent.name)
    .forEach(async (service: string) => {
      const Service = await import(`${serviceOrg}/${service}`);
      new Service.default(app, service, { env });
    });

initServices(`${process.cwd()}/node_modules/${serviceOrg}`);

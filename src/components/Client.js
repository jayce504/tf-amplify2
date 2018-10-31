import AWSAppSyncClient, { defaultDataIdFromObject } from "aws-appsync";
import appSyncConfig from "../aws-exports";

const Client = new AWSAppSyncClient({
    url: appSyncConfig.aws_appsync_graphqlEndpoint,
    region: appSyncConfig.aws_appsync_region,
    auth: {
      type: appSyncConfig.aws_appsync_authenticationType,
      apiKey: appSyncConfig.aws_appsync_apiKey,
    },
    cacheOptions: {
      dataIdFromObject: (obj) => {
        let id = defaultDataIdFromObject(obj);
  
        if (!id) {
          const { __typename: typename } = obj;
          switch (typename) {
            case 'Comment':
              return `${typename}:${obj.commentId}`;
            default:
              return id;
          }
        }
  
        return id;
      }
    }
  });

  export default Client
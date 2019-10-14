import {
  httpController,
  createService,
  createInsecureClientOptions,
  ServiceOperation
} from "nodoo";

interface GetDataSetParam {
  context: {
    sessionToken?: string;
  };
}
interface GetServiceParam {
  operation: ServiceOperation;
  onResult: (result: any) => any;
  onError: (error: any) => void;
}

// get operation for configureService that does not need auth
export const getSessionAuthNone = () =>
  httpController().operation.session.authNone;

// get operation for configureService that needs auth
export const getDataSet = ({ context }: GetDataSetParam) =>
  httpController().operation.dataSet({
    sessionToken: context.sessionToken
  });

// creates service with defaults
export const configureService = ({
  operation,
  onResult,
  onError
}: GetServiceParam) => {
  const clientOptions = createInsecureClientOptions({
    host: "178.128.103.135",
    port: 8069
  });

  createService({
    operation,
    clientOptions
  }).addListener({
    next: result => {
      result.fold(onError, onResult);
    }
  });
};

// returns a promise to get length of total count of model `modelName`
// with searchRead method
export const getTotalCountPromise = ({
  context,
  modelName
}: GetTotalCountPromiseParam): Promise<TotalCountObject> =>
  new Promise((res, rej) => {
    configureService({
      operation: getDataSet({
        context
      }).createSearchRead({
        modelName,
        fields: [],
        domain: []
      }),
      onError: error => {
        rej(
          new ApolloError("Application Error", "APPLICATION_ERROR", {
            errorMessage: error.message
          })
        );
      },
      onResult: result => res({ totalCount: result.length })
    });
  });

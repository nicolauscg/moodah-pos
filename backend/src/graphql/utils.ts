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

// apply createAuthenticate to return operation
export const getSessionAuthNone = () =>
  httpController().operation.session.authNone;

// apply createSearchRead, createRead ... to return operation
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

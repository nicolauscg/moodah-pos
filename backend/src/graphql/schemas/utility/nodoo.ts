import {
  httpController,
  createService,
  ServiceOperation,
  createInsecureClientOptions
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
const getSessionAuthNone = () => httpController().operation.session.authNone;

// get operation for configureService that needs auth
const getDataSet = ({ context }: GetDataSetParam) =>
  httpController().operation.dataSet({
    sessionToken: context.sessionToken
  });

// create service with defaults
const configureService = ({
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

export { getSessionAuthNone, getDataSet, configureService };

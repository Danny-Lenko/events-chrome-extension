import { GeneralServiceInterface } from '../../../core/coreInterfaces';

export interface RulesIntermediaryInterface extends GeneralServiceInterface {
   getRules(): Promise<{
      adminEmail: string;
      emailServices: {
         filterString: string;
      };
   }>;
}

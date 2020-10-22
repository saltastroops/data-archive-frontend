/**
 * The cache for the search form.
 *
 * The general and target details (and errors) are cached.
 */
import {
  IGeneral,
  ITarget,
  ITelescope,
} from "../../utils/ObservationQueryParameters";

export default interface ISearchFormCache {
  general?: IGeneral;
  target?: ITarget;
  telescope?: ITelescope;
}

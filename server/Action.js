import { Unit } from './Unit';

export class Action {
    target = null;
    owner = null;
    ability = null;

    isValid() {
        if (target != null && owner != null && ability != null)
            return true;
        return false;
    }
}
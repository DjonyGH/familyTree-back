import { EType } from '../permissions/types';
import { TreeModel } from './tree.model';

export interface ITreeResponse extends TreeModel {
  typePermission: EType;
}

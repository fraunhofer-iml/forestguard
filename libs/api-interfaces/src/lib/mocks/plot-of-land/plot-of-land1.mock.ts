import { PlotOfLandDto } from '../../dtos';
import { product1Mock } from './product1.mock';
import { proof1Mock } from './proof1.mock';

export const plotOfLand1Mock: PlotOfLandDto = {
  id: '53252ae9-fb8e-4a19-8f03-ed6ed5977501',
  country: 'Peru',
  region: 'Ucayali',
  district: 'Coronel Portillo',
  nationalPlotOfLandId: 'n1',
  localPlotOfLandId: 'l1',
  description: 'Lorem ipsum dolor sit amet.',
  polygonData: '[{ lat: -32.364, lng: 153.207 }]',
  areaInHA: 1,
  cultivatedWith: product1Mock,
  proofs: [proof1Mock]
}

/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoordinateType, FGFile, ProofDto, ProofType } from '@forest-guard/api-interfaces';
import { Icon, latLng, LatLng, Layer, marker, polygon, tileLayer } from 'leaflet';
import { toast } from 'ngx-sonner';
import { BehaviorSubject, catchError, EMPTY, map, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UploadFormSelectType } from '../../../shared/components/upload-form/upload-form-select.type';
import { Messages } from '../../../shared/messages';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { GeoInformation } from '../../../shared/services/plotOfLand/types/geo-information.types';
import {
  convertFromMultiPolygon,
  convertFromMultiPoint,
  convertFromPoint,
  convertFromPolygon,
  CoordinateInput,
} from '@forest-guard/utm';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-pol-details',
  templateUrl: './details.component.html',
})
export class PlotOfLandDetailsComponent {
  id$ = this.route.params.pipe(map((params) => params['id']));
  reload$ = new BehaviorSubject(undefined);
  plotOfLand$ = this.reload$.pipe(
    switchMap(() => this.id$),
    switchMap((id) => this.plotOfLandService.getPlotOfLandById(id)),
    tap((plotOfLand) => {
      this.updateMap(plotOfLand.geoData ?? '');
    }),
  );

  MINIO_URL = environment.MINIO.URL;
  ProofType = ProofType;
  protected readonly getUserOrCompanyName = getUserOrCompanyName;
  protected readonly window = window;

  center: LatLng = latLng(51.514, 7.468);
  layers: Layer[] = [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })];

  uploadSelectOption: UploadFormSelectType[] = [
    {
      value: ProofType.PROOF_OF_FREEDOM,
      key: 'Proof of freedom from deforestation',
    },
    {
      value: ProofType.PROOF_OF_OWNERSHIP,
      key: 'Proof of ownership',
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly plotOfLandService: PlotOfLandService,
  ) {
  }

  getProof(type: ProofType, proofs?: ProofDto[]): ProofDto | undefined {
    return proofs?.find((proof) => proof.type === type);
  }

  hasFileUploaded(type?: string): boolean {
    return this.uploadSelectOption?.filter((option) => option.value === type && option.file).length > 0;
  }

  getFilteredOptions(proofs: ProofDto[] | undefined): UploadFormSelectType[] {
    const selectedProofTypes = (proofs || []).map((proofDto) => proofDto.type);
    return (this.uploadSelectOption || []).filter((option) => !selectedProofTypes.includes(option.value));
  }

  uploadProof({ file, documentType }: FGFile, id: string | undefined): void {
    const option = this.uploadSelectOption.find((option) => option.value === documentType);

    if (!option) return;
    option.file = file;

    if (option.file && id != undefined) {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('type', option.value);
      this.plotOfLandService
        .createProof(id, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            toast.error(error.error.message);
            return EMPTY;
          }),
        )
        .subscribe(() => {
          this.reload$.next(undefined);
          this.hasFileUploaded(option?.value);
          toast.success(Messages.successProof);
        });
    }
  }

  updateMap(geoData: string): void {
    const typedGeoData = JSON.parse(geoData) satisfies GeoInformation;

    if (typedGeoData.features.length === 0) return;

    switch (typedGeoData.features[0].geometry.type) {
      case CoordinateType.Point: {
        const coordinates = convertFromPoint(typedGeoData.features[0].geometry.coordinates as [number, number]);
        this.updateMarkers(coordinates);
        break;
      }
      case CoordinateType.MultiPoint: {
        const coordinates = convertFromMultiPoint(typedGeoData.features[0].geometry.coordinates as [number, number][]);
        this.updateMarkers(coordinates);
        break;
      }
      case CoordinateType.Polygon: {
        const polygons = convertFromPolygon(typedGeoData.features[0].geometry.coordinates as [number, number][][]);
        this.updatePolygons(polygons);
        break;
      }
      case CoordinateType.MultiPolygon: {
        const polygons = convertFromMultiPolygon(typedGeoData.features[0].geometry.coordinates as [number, number][][][]);
        this.updatePolygons(polygons);
        break;
      }
    }
  }

  updateMarkers(coordinates: CoordinateInput): void {
    if (!coordinates || coordinates.length === 0) return;
    const markers = coordinates[0].map((coordinate: { x: number; y: number }) => {
      return marker([coordinate.x || 0, coordinate.y || 0], { icon: new Icon.Default({ imagePath: './media/' }) });
    });

    this.layers = [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }), ...markers];
    this.center = latLng(coordinates[0][0].x || 0, coordinates[0][0].y || 0);
  }

  updatePolygons(coordinates: CoordinateInput): void {
    if (!coordinates || coordinates.length === 0) return;
    const polygons = coordinates.map((coordinate) => {
      return polygon(coordinate.map((point: { x: number; y: number }) => [point.x || 0, point.y || 0]));
    });

    this.layers = [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }), ...polygons];
    this.center = latLng(coordinates[0][0].x || 0, coordinates[0][0].y || 0);
  }
}

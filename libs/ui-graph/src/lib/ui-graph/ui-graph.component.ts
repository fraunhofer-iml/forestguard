/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Edge } from '@forest-guard/api-interfaces';
import { BaseType, select as d3_select, zoom as d3_zoom, zoomIdentity as d3_zoomIdentity, easeQuadInOut, Selection } from 'd3';
import { sankey as d3_sankey, sankeyLeft as d3_sankeyLeft, sankeyLinkHorizontal as d3_sankeyLinkHorizontal } from 'd3-sankey';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-ui-graph',
  template: '',
})
export class UiGraphComponent implements OnInit, OnChanges {
  @Input() data?: { nodes: any[]; links: any[] } | null;
  @Input() width = 900;
  @Input() height = 600;
  @Input() selectedNode?: string;
  @Input() invalidEdges: Edge[] | null = [];
  @Input() transitionLength = 200;
  @Input() nodesWithEUInfoSystemId: string[] | null = [];
  @Input() nodesWithProcessDocuments: string[] | null = [];

  @Input() validNodeColor = '#436814';
  @Input() invalidNodeColor = '#ab2020';
  @Input() selectedNodeColor = '#eebc88';
  @Input() selectedNodeBorderColor = '#000';
  @Input() selectedNodeTextColor = '#000';
  @Input() nonSelectedNodeTextColor = '#fff';

  @Input() linkTextColor = '#000';
  @Input() linkColor = '#f3f4f6';
  @Input() linkBorderColor = '#5e5f59';

  @Output() nodeClick = new EventEmitter<string>();

  private minWidth = 1500;
  private minHeight = 600;
  private margin?: { top: number; right: number; bottom: number; left: number };
  private chart?: Selection<SVGSVGElement, unknown, null, undefined>;
  private svg?: Selection<SVGSVGElement, unknown, null, undefined>;
  private container?: Selection<SVGGElement, unknown, null, undefined>;
  private links?: Selection<SVGGElement, unknown, null, undefined>;
  private nodes?: Selection<SVGGElement, unknown, null, undefined>;
  private icons?: Selection<SVGGElement, unknown, null, undefined>;
  private sankey?: any;
  private zoomFn?: any;
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private readonly euInfoSystemTooltipText = 'EU System Info ID available';
  private readonly processDocumentsTooltipText = 'Process-specific documents available';
  private readonly batchInformationTooltipTemplate = (data: any): string =>
    `<strong>Batch ${data.id}</strong>\nProcess:\t\t\t\t${data.name}\nWeight [kg]:\t\t\t${data.weight}\nDate of Process:\t${new Date(data.processStepDateOfProcess).toLocaleString()}`;

  private readonly iconSize = 48;
  private readonly euInfoIconPath =
    'M481-781q106 0 200 45.5T838-604q7 9 4.5 16t-8.5 12q-6 5-14 4.5t-14-8.5q-55-78-141.5-119.5T481-741q-97 0-182 41.5T158-580q-6 9-14 10t-14-4q-7-5-8.5-12.5T126-602q62-85 155.5-132T481-781Zm0 94q135 0 232 90t97 223q0 50-35.5 83.5T688-257q-51 0-87.5-33.5T564-374q0-33-24.5-55.5T481-452q-34 0-58.5 22.5T398-374q0 97 57.5 162T604-121q9 3 12 10t1 15q-2 7-8 12t-15 3q-104-26-170-103.5T358-374q0-50 36-84t87-34q51 0 87 34t36 84q0 33 25 55.5t59 22.5q34 0 58-22.5t24-55.5q0-116-85-195t-203-79q-118 0-203 79t-85 194q0 24 4.5 60t21.5 84q3 9-.5 16T208-205q-8 3-15.5-.5T182-217q-15-39-21.5-77.5T154-374q0-133 96.5-223T481-687Zm0-192q64 0 125 15.5T724-819q9 5 10.5 12t-1.5 14q-3 7-10 11t-17-1q-53-27-109.5-41.5T481-839q-58 0-114 13.5T260-783q-8 5-16 2.5T232-791q-4-8-2-14.5t10-11.5q56-30 117-46t124-16Zm0 289q93 0 160 62.5T708-374q0 9-5.5 14.5T688-354q-8 0-14-5.5t-6-14.5q0-75-55.5-125.5T481-550q-76 0-130.5 50.5T296-374q0 81 28 137.5T406-123q6 6 6 14t-6 14q-6 6-14 6t-14-6q-59-62-90.5-126.5T256-374q0-91 66-153.5T481-590Zm-1 196q9 0 14.5 6t5.5 14q0 75 54 123t126 48q6 0 17-1t23-3q9-2 15.5 2.5T744-191q2 8-3 14t-13 8q-18 5-31.5 5.5t-16.5.5q-89 0-154.5-60T460-374q0-8 5.5-14t14.5-6Z';

  private readonly documentsIconPath =
    'M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z';

  constructor(private _element: ElementRef) {}

  ngOnInit(): void {
    this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');

    this.svg = this.chart
      .append('svg')
      .attr('class', 'img-fluid')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('id', 'dependencyGraphSvg');

    this.container = this.svg.append('g').attr('class', 'container');
    this.links = this.container.append('g').attr('class', 'links').attr('class', 'dependencyGraphElement');
    this.nodes = this.container.append('g').attr('class', 'nodes').attr('class', 'dependencyGraphElement');
    this.icons = this.container.append('g').attr('class', 'icons').attr('class', 'dependencyGraphElement');

    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes && changes['data'] && !changes['data'].firstChange) ||
      changes['width'] ||
      changes['height'] ||
      changes['selectedNode'] ||
      changes['invalidEdges'] ||
      changes['nodesWithEUInfoSystemId'] ||
      changes['nodesWithProcessDocuments']
    ) {
      this.update();
    }
  }

  private getMaxXandY() {
    if (!this.data) {
      return {
        maxLayer: 0,
        maxNumberOfNodesOnLayer: 0,
      };
    }

    const sankey = d3_sankey()
      .nodeId((d: any) => {
        return d.id;
      })
      .nodeWidth(64)
      .nodeAlign(d3_sankeyLeft);
    const chart = sankey(this.data);
    const maxLayer = Math.max(...chart.nodes.map((node: any) => node.layer));
    // get the maximum parallel nodes on the same layer
    const maxNumberOfNodesOnLayer = Math.max(
      ...Array.from({ length: maxLayer + 1 }, (_, i) => chart.nodes.filter((node: any) => node.layer === i).length)
    );

    return {
      maxLayer,
      maxNumberOfNodesOnLayer,
    };
  }

  async update(): Promise<void> {
    if (!this.data || !this.invalidEdges || !this.nodesWithEUInfoSystemId || !this.nodesWithProcessDocuments) {
      return;
    }

    const invalidLinkSet = new Set(this.invalidEdges?.map((edge) => `${edge.from}${edge.to}`));
    const getFillColor = (d: any) => {
      const isSelectedNode = d.id === this.selectedNode;
      const existInvalidEdges = this.invalidEdges?.some((edge) => edge.from === d.id || edge.to === d.id);

      if (existInvalidEdges) {
        return isSelectedNode ? this.selectedNodeColor : this.invalidNodeColor;
      }

      return isSelectedNode ? this.selectedNodeColor : this.validNodeColor;
    };

    if (!this.svg || !this.container || !this.links || !this.nodes || !this.data || !this.margin || !this.icons) {
      return console.error('Missing svg, container, links or nodes');
    }

    const { maxLayer, maxNumberOfNodesOnLayer } = this.getMaxXandY();

    const svgElement = d3_select('svg');
    this.zoomFn = d3_zoom()
      .scaleExtent([Math.min(1 / (maxNumberOfNodesOnLayer / 15), 0.3), 2])
      .on('zoom', function (event) {
        svgElement.selectAll('.dependencyGraphElement').attr('transform', event.transform);
      });
    svgElement.call(this.zoomFn);
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('cursor', 'move')
      .attr('viewBox', `-${this.margin?.left} -${this.margin?.top} ${this.width} ${this.height}`);
    this.container.attr('transform', null);
    this.centerGraph();

    this.sankey = d3_sankey()
      .nodeId((d: any) => {
        return d.id;
      })
      .nodeWidth(64)
      .nodeAlign(d3_sankeyLeft)
      .nodePadding(maxNumberOfNodesOnLayer * 100)
      .size([
        Math.max(this.width * (Math.sqrt(maxLayer) * Math.max(Math.log(maxNumberOfNodesOnLayer) - 0.4, 0.1)), this.minWidth) -
          this.margin.left -
          this.margin.right,
        Math.max(maxNumberOfNodesOnLayer * 250, this.minHeight) - this.margin.top - this.margin.bottom,
      ]);

    this.sankey(this.data);

    this.links
      .attr('fill', 'none')
      .selectAll('path')
      .data(this.data.links, (d: any) => `${d.target.id}-${d.source.id}`)
      .join(
        (enter) => {
          return enter
            .append('path')
            .attr('d', d3_sankeyLinkHorizontal())
            .attr('stroke-width', '5')
            .attr('stroke', (d) => (invalidLinkSet.has(`${d.source?.id}${d.target?.id}`) ? this.invalidNodeColor : this.validNodeColor))
            .style('opacity', 1)
            .style('mix-blend-mode', 'multiply');
        },
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('d', d3_sankeyLinkHorizontal())
            .attr('stroke-width', '5')
            .attr('stroke', (d) => (invalidLinkSet.has(`${d.source?.id}${d.target?.id}`) ? this.invalidNodeColor : this.validNodeColor)),
        (exit) => exit.remove()
      );

    this.links
      .selectAll('rect')
      .data(this.data.links, (d: any) => `${d.target.id}${d.source.id}`)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', this.linkColor)
            .attr('width', 150)
            .attr('height', 30)
            .attr('rx', 8)
            .attr('x', (d) => (d.source.x1 + d.target.x0) / 2 - 75)
            .attr('y', (d) => (d.y0 + d.y1) / 2 - 15)
            .attr('stroke', this.linkBorderColor)
            .attr('stroke-width', '0.5px')
            .attr('stroke-linecap', 'round'),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => (d.source.x1 + d.target.x0) / 2 - 75)
            .attr('y', (d) => (d.y0 + d.y1) / 2 - 15),
        (exit) => exit.remove()
      );

    this.links
      .selectAll('text')
      .data(this.data.links, (d: any) => `${d.target.id}${d.source.id}`)
      .join(
        (enter) =>
          enter
            .append('text')
            .text((d) => d.target.name)
            .attr('x', (d) => (d.source.x1 + d.target.x0) / 2)
            .attr('y', (d) => (d.y0 + d.y1) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', this.linkTextColor),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => (d.source.x1 + d.target.x0) / 2)
            .attr('y', (d) => (d.y0 + d.y1) / 2),
        (exit) => exit.remove()
      );

    this.nodes
      .selectAll('rect')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('x', (d) => d.x0 || 0)
            .attr('y', (d) => d.y0 - 75 || 100)
            .attr('height', (d) => d.y1 - d.y0 + 150 || 250)
            .attr('width', (d) => d.x1 - d.x0 || 50)
            .attr('fill', getFillColor)
            .attr('stroke', this.selectedNodeBorderColor)
            .attr('stroke-width', (d) => {
              return d.id === this.selectedNode ? '3px' : '0px';
            })
            .attr('rx', 12)
            .attr('border-radius', '12px')
            .attr('cursor', 'pointer')
            .attr('opacity', 1),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => d.x0 || 0)
            .attr('y', (d) => d.y0 - 75 || 0)
            .attr('fill', getFillColor)
            .attr('stroke', this.selectedNodeBorderColor)
            .attr('stroke-width', (d) => {
              return d.id === this.selectedNode ? '3px' : '0px';
            })
            .attr('height', (d) => d.y1 - d.y0 + 150 || this.height)
            .attr('width', (d) => d.x1 - d.x0 || 50),
        (exit) => exit.remove()
      )
      .on('mouseover', (event, data) =>
        this.onMouseOverElement('tooltip-batch-information', this.batchInformationTooltipTemplate(data), event, data)
      )
      .on('mousemove', (event, data) => this.onMouseMoveElement('tooltip-batch-information', event, data))
      .on('mouseout', (event, data) => this.onMouseOutElement('tooltip-batch-information', event, data))
      .on('click', (event, data) => this.onMouseEnter(event, data));

    this.nodes
      .selectAll('text.label-text')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'label-text')
            .text((d) => `Batch ...${d.id.slice(-8)}`)
            .attr('fill', (d) => (d.id === this.selectedNode ? this.selectedNodeTextColor : this.nonSelectedNodeTextColor))
            .attr('font-weight', '500')
            .attr('text-anchor', 'middle')
            .attr('x', (d) => d.x0 + (d.x1 - d.x0) / 2)
            .attr('y', (d) => d.y0 + (d.y1 - d.y0) / 2)
            .attr('dy', '0.25em')
            .attr('cursor', 'pointer')
            .attr('transform', (d) => {
              const x = d.x0 + (d.x1 - d.x0) / 2;
              const y = d.y0 + (d.y1 - d.y0) / 2;
              return `rotate(270, ${x}, ${y})`;
            }),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('fill', (d) => (d.id === this.selectedNode ? this.selectedNodeTextColor : this.nonSelectedNodeTextColor))
            .attr('x', (d) => {
              return d.x0 + (d.x1 - d.x0) / 2;
            })
            .attr('y', (d) => {
              return d.y0 + (d.y1 - d.y0) / 2;
            })
            .attr('transform', (d) => {
              const x = d.x0 + (d.x1 - d.x0) / 2;
              const y = d.y0 + (d.y1 - d.y0) / 2;
              return `rotate(270, ${x}, ${y})`;
            })
      )
      .on('mouseover', (event, data) =>
        this.onMouseOverElement('tooltip-batch-information', this.batchInformationTooltipTemplate(data), event, data)
      )
      .on('mousemove', (event, data) => this.onMouseMoveElement('tooltip-batch-information', event, data))
      .on('mouseout', (event, data) => this.onMouseOutElement('tooltip-batch-information', event, data))
      .on('click', (event, data) => this.onMouseEnter(event, data));

    this.addVisualIndicators();
    this.setBatchInformationTooltipDiv();
  }

  /**
   * Initializes and appends a tooltip div to the body for displaying batch information.
   */
  private setBatchInformationTooltipDiv() {
    // Tooltip styles for batch information
    d3_select('body')
      .append('div')
      .attr('id', 'tooltip-batch-information')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('background-color', 'rgba(243, 244, 246, 0.75)')
      .style('color', '#000000')
      .style('padding', '12px')
      .style('border-radius', '12px')
      .style('pointer-events', 'none')
      .style('white-space', 'pre-wrap')
      .style('backdrop-filter', 'blur(5px)');
  }

  private addVisualIndicators() {
    if (!this.svg || !this.container || !this.links || !this.nodes || !this.data || !this.margin || !this.icons) {
      return console.error('Missing svg, container, links or nodes');
    }

    // Tooltip styles for icon-eu-info-system
    d3_select('body')
      .append('div')
      .attr('id', 'tooltip-icon-eu-info-system')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('background', 'rgba(243, 244, 246, 0.75)')
      .style('color', '#000000')
      .style('padding', '12px')
      .style('border-radius', '12px')
      .style('pointer-events', 'none')
      .style('backdrop-filter', 'blur(5px)');

    // Tooltip styles for icon-process-documents
    d3_select('body')
      .append('div')
      .attr('id', 'tooltip-icon-process-documents')
      .style('position', 'absolute')
      .style('display', 'none')
      .style('background', 'rgba(243, 244, 246, 0.75)')
      .style('color', '#000000')
      .style('padding', '12px')
      .style('border-radius', '12px')
      .style('pointer-events', 'none')
      .style('backdrop-filter', 'blur(5px)');

    this.nodes
      .selectAll('svg.icon-eu-info-system-hover')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .filter((d) => this.nodesWithProcessDocuments?.includes(d.id) || false)
            .append('rect')
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => d.y0 - 72)
            .attr('width', this.iconSize)
            .attr('height', this.iconSize)
            .attr('fill', 'transparent')
            .on('mouseover', (event, data) =>
              this.onMouseOverElement('tooltip-icon-eu-info-system', this.euInfoSystemTooltipText, event, data)
            )
            .on('mousemove', (event, data) => this.onMouseMoveElement('tooltip-icon-eu-info-system', event, data))
            .on('mouseout', (event, data) => this.onMouseOutElement('tooltip-icon-eu-info-system', event, data)),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => (this.nodesWithEUInfoSystemId?.includes(d.id) ? d.y0 - 22 : d.y0 - 72)),
        (exit) => exit.remove()
      );

    this.nodes
      .selectAll('svg.icon-eu-info-system')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .filter((d) => this.nodesWithEUInfoSystemId?.includes(d.id) || false)
            .append('svg')
            .attr('class', 'icon-eu-info-system')
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => d.y0 - 72)
            .attr('width', this.iconSize)
            .attr('height', this.iconSize)
            .attr('fill', '#000')
            .attr('viewBox', '0 -960 960 960')
            .append('path')
            .attr('d', this.euInfoIconPath)
            .on('mouseover', (event, data) =>
              this.onMouseOverElement('tooltip-icon-eu-info-system', this.euInfoSystemTooltipText, event, data)
            )
            .on('mousemove', (event, data) => this.onMouseMoveElement('tooltip-icon-eu-info-system', event, data))
            .on('mouseout', (event, data) => this.onMouseOutElement('tooltip-icon-eu-info-system', event, data)),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => d.y0 - 72),
        (exit) => exit.remove()
      );

    this.nodes
      .selectAll('svg.icon-process-documents-hover')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .filter((d) => this.nodesWithProcessDocuments?.includes(d.id) || false)
            .append('rect')
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => (this.nodesWithEUInfoSystemId?.includes(d.id) ? d.y0 - 22 : d.y0 - 72))
            .attr('width', this.iconSize)
            .attr('height', this.iconSize)
            .attr('fill', 'transparent')
            .on('mouseover', (event, data) =>
              this.onMouseOverElement('tooltip-icon-process-documents', this.processDocumentsTooltipText, event, data)
            )
            .on('mousemove', (event, data) => this.onMouseMoveElement('tooltip-icon-process-documents', event, data))
            .on('mouseout', (event, data) => this.onMouseOutElement('tooltip-icon-process-documents', event, data)),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => (this.nodesWithEUInfoSystemId?.includes(d.id) ? d.y0 - 22 : d.y0 - 72)),
        (exit) => exit.remove()
      );

    this.nodes
      .selectAll('svg.icon-process-documents')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .filter((d) => this.nodesWithProcessDocuments?.includes(d.id) || false)
            .append('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => d.y0 - 22)
            .attr('class', 'icon-process-documents')
            .attr('width', this.iconSize)
            .attr('height', this.iconSize)
            .on('mouseover', (event, data) =>
              this.onMouseOverElement('tooltip-icon-process-documents', this.processDocumentsTooltipText, event, data)
            )
            .on('mousemove', (event, data) => this.onMouseMoveElement('tooltip-icon-process-documents', event, data))
            .on('mouseout', (event, data) => this.onMouseOutElement('tooltip-icon-process-documents', event, data))
            .attr('viewBox', '0 -960 960 960')
            .append('path')
            .attr('d', this.documentsIconPath)
            .attr('fill', '#000'),

        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => (this.nodesWithEUInfoSystemId?.includes(d.id) ? d.y0 - 22 : d.y0 - 72)),
        (exit) => exit.remove()
      );
  }

  /**
   * Handles the mouse out event on an element, causing the tooltip to fade out and hide.
   *
   * @param tooltipId - The ID of the tooltip element.
   * @param event - The mouse event object.
   * @param data - Additional data that might be needed for handling the mouse out event.
   */
  private onMouseOutElement(tooltipId: string, event: any, data: any) {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }

    const tooltip = d3_select('#' + tooltipId).style('opacity', '0');

    this.hideTimeout = window.setTimeout(() => {
      tooltip.style('display', 'none');
    }, 150);
  }

  /**
   * Handles the mouse move event over an element, updating the position of the tooltip.
   *
   * @param tooltipId - The ID of the tooltip element.
   * @param event - The mouse event object containing the current mouse position.
   * @param data - Additional data that might be needed for handling the mouse move event.
   */
  private onMouseMoveElement(tooltipId: string, event: { pageX: number; pageY: number }, data: any) {
    d3_select('#' + tooltipId)
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY + 5}px`);
  }

  /**
   * Handles the mouse over event on an element, causing the tooltip to appear and display a message.
   *
   * @param tooltipId - The ID of the tooltip element.
   * @param message - The message to be displayed inside the tooltip.
   * @param event - The mouse event object containing the current mouse position.
   * @param data - Additional data that might be needed for handling the mouse over event.
   */
  private onMouseOverElement(tooltipId: string, message: string, event: { pageX: number; pageY: number }, data: any) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    const tooltip = d3_select('#' + tooltipId)
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY + 5}px`)
      .style('display', 'block')
      .style('opacity', '0')
      .style('transition', 'opacity 0.15s ease-in-out')
      .html(message);

    this.showTimeout = window.setTimeout(() => {
      tooltip.style('opacity', '1');
    }, 0);
  }

  onMouseEnter(event: any, data: any) {
    const element = d3_select(event.target);
    this.nodeClick.emit((element.data()[0] as any).id);
  }

  /**
   * Centers the graph within the SVG element and applies a zoom factor.
   *
   * @param zoomFactor - The factor by which to zoom the graph. Default is 0.7.
   */
  centerGraph(zoomFactor = 0.2) {
    const svgSelection = d3_select('svg');
    const zoomCall = svgSelection.transition().duration(this.transitionLength);

    zoomCall.call(this.zoomFn.transform, d3_zoomIdentity.translate(0, 0));
    zoomCall.call(this.zoomFn.scaleTo, zoomFactor);
  }

  /**
   * Focuses on the currently selected batch (node) within the graph, applying a zoom factor.
   *
   * @param zoomFactor - The factor by which to zoom the graph. Default is 1.5.
   */
  focusOnCurrentBatch(zoomFactor = 1) {
    const svgSelection = d3_select('svg');
    const zoomCall = svgSelection.transition().duration(this.transitionLength);

    if (!this.svg || !this.container || !this.links || !this.nodes || !this.data || !this.margin) {
      return console.error('Missing svg, container, links or nodes');
    }

    const selected: Selection<BaseType, unknown, SVGGElement, unknown> = this.nodes.selectAll(`rect`).filter((d: any) => {
      return d.id === this.selectedNode;
    });

    if (!selected.empty()) {
      const centerX = this.width / (2 * zoomFactor) - +selected.attr('x') - +selected.attr('width') / 2;
      const centerY = this.height / (2 * zoomFactor) - +selected.attr('y') - +selected.attr('height') / 2;

      zoomCall.call(this.zoomFn.transform, d3_zoomIdentity.scale(zoomFactor).translate(centerX, centerY));
    } else {
      console.error('Selected node not found');
    }
  }

  /**
   * Saves the current dependency graph as an SVG file.
   *
   * @param svgHtmlElement - The SVG HTML element representing the graph.
   * @param name - The name to use for the saved SVG file.
   */
  async saveGraphAsSvg(svgHtmlElement: HTMLElement, name: string) {
    this.centerGraph();
    await delay(this.transitionLength + 50);

    svgHtmlElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgData = svgHtmlElement.outerHTML;
    const xmlHeader = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([xmlHeader, svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');

    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}

/**
 * Creates a delay for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
const delay = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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
  @Input() transitionLength = 300;
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

  private margin?: { top: number; right: number; bottom: number; left: number };
  private chart?: Selection<SVGSVGElement, unknown, null, undefined>;
  private svg?: Selection<SVGSVGElement, unknown, null, undefined>;
  private container?: Selection<SVGGElement, unknown, null, undefined>;
  private links?: Selection<SVGGElement, unknown, null, undefined>;
  private nodes?: Selection<SVGGElement, unknown, null, undefined>;
  private sankey?: any;
  private zoomFn?: any;
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private readonly materialIconsMap: { [key: string]: string } = {
    description: '\ue873',
    fingerprint: '\ue90d',
  };
  private readonly euInfoSystemTooltipText = 'EU System Info ID available';
  private readonly processDocumentsTooltipText = 'Process-specific documents available';
  private readonly batchInformationTooltipTemplate = (data: any): string =>
    `<strong>Batch ${data.id}</strong>\nProcess:\t\t\t\t\t${data.name}\nWeight [kg]:\t\t\t${data.weight}\nDate of Process:\t${new Date(data.processStepDateOfProcess).toLocaleString()}`;

  constructor(private _element: ElementRef) {}

  ngOnInit(): void {
    this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');

    this.svg = this.chart
      .append('svg')
      .attr('class', 'img-fluid')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('id', 'dependencyGraphSvg');

    const svgElement = d3_select('svg');
    this.zoomFn = d3_zoom()
      .scaleExtent([0.7, 2])
      .translateExtent([
        [-this.width / 8, -this.height / 8],
        [this.width + this.width / 8, this.height + this.height / 8],
      ])
      .on('zoom', function (event) {
        svgElement.selectAll('.dependencyGraphElement').attr('transform', event.transform);
      });
    svgElement.call(this.zoomFn);

    this.container = this.svg.append('g').attr('class', 'container');
    this.links = this.container.append('g').attr('class', 'links').attr('class', 'dependencyGraphElement');
    this.nodes = this.container.append('g').attr('class', 'nodes').attr('class', 'dependencyGraphElement');

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

  update(): void {
    const invalidLinkSet = new Set(this.invalidEdges?.map((edge) => `${edge.from}${edge.to}`));
    const getFillColor = (d: any) => {
      const isSelectedNode = d.id === this.selectedNode;
      const existInvalidEdges = this.invalidEdges?.some((edge) => edge.from === d.id || edge.to === d.id);

      if (existInvalidEdges) {
        return isSelectedNode ? this.selectedNodeColor : this.invalidNodeColor;
      }

      return isSelectedNode ? this.selectedNodeColor : this.validNodeColor;
    };

    if (!this.svg || !this.container || !this.links || !this.nodes || !this.data || !this.margin) {
      return console.error('Missing svg, container, links or nodes');
    }

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
      .nodePadding(200)
      .size([this.width - this.margin.left - this.margin.right, this.height - this.margin.top - this.margin.bottom])
      .iterations(2);

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
            .attr('x', (d) => d.x0 + (d.x1 - d.x0) / 2 || -75)
            .attr('y', (d) => d.y0 + (d.y1 - d.y0) / 2 || 25)
            .attr('dy', '0.25em')
            .attr('cursor', 'pointer')
            .attr('transform', (d) => {
              const x = d.x0 + (d.x1 - d.x0) / 2 || 100;
              const y = d.y0 + (d.y1 - d.y0) / 2 || 100;
              return `rotate(270, ${x}, ${y})`;
            }),
        (update) =>
          update
            .transition()
            .duration(this.transitionLength)
            .ease(easeQuadInOut)
            .attr('fill', (d) => (d.id === this.selectedNode ? this.selectedNodeTextColor : this.nonSelectedNodeTextColor))
            .attr('x', (d) => {
              return d.x0 + (d.x1 - d.x0) / 2 || -this.height / 2;
            })
            .attr('y', (d) => {
              return d.y0 + (d.y1 - d.y0) / 2 || 25;
            })
            .attr('transform', (d) => {
              const x = d.x0 + (d.x1 - d.x0) / 2 || 0;
              const y = d.y0 + (d.y1 - d.y0) / 2 || 0;
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
    if (!this.svg || !this.container || !this.links || !this.nodes || !this.data || !this.margin) {
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
      .selectAll('text.icon-eu-info-system')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .filter((d) => this.nodesWithEUInfoSystemId?.includes(d.id) || false)
            .attr('class', 'icon-eu-info-system')
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => d.y0 - 52)
            .attr('font-family', 'Material Symbols Outlined')
            .attr('font-size', '48px')
            .text(this.getIconUnicode('fingerprint'))
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
            .attr('y', (d) => d.y0 - 52)
            .text(this.getIconUnicode('fingerprint')),
        (exit) => exit.remove()
      );

    this.nodes
      .selectAll('text.icon-process-documents')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .filter((d) => this.nodesWithProcessDocuments?.includes(d.id) || false)
            .attr('class', 'icon-process-documents')
            .attr('x', (d) => d.x0 + 72)
            .attr('y', (d) => (this.nodesWithEUInfoSystemId?.includes(d.id) ? d.y0 + 0 : d.y0 - 52))
            .attr('font-family', 'Material Symbols Outlined')
            .attr('font-size', '48px')
            .text(this.getIconUnicode('description'))
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
            .attr('y', (d) => (this.nodesWithEUInfoSystemId?.includes(d.id) ? d.y0 + 0 : d.y0 - 52))
            .text(this.getIconUnicode('description')),
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
  centerGraph(zoomFactor = 0.7) {
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
  focusOnCurrentBatch(zoomFactor = 1.5) {
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

  private getIconUnicode(iconName: string): string {
    return this.materialIconsMap[iconName] || '';
  }
}

/**
 * Creates a delay for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
const delay = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

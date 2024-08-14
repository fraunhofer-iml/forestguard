import { Edge } from '@forest-guard/api-interfaces';
import { select as d3_select, zoom as d3_zoom, easeQuadInOut, local, Selection } from 'd3';
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

  @Output() nodeClick = new EventEmitter<string>();

  private margin?: { top: number; right: number; bottom: number; left: number };
  private chart?: Selection<SVGSVGElement, unknown, null, undefined>;
  private svg?: Selection<SVGSVGElement, unknown, null, undefined>;
  private container?: Selection<SVGGElement, unknown, null, undefined>;
  private links?: Selection<SVGGElement, unknown, null, undefined>;
  private nodes?: Selection<SVGGElement, unknown, null, undefined>;
  private sankey?: any;

  constructor(private _element: ElementRef) {}

  ngOnInit(): void {
    this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    this.chart = d3_select(this._element.nativeElement).attr('aria-hidden', 'true');

    this.svg = this.chart.append('svg').attr('class', 'img-fluid').attr('preserveAspectRatio', 'xMidYMid meet');

    this.container = this.svg.append('g').attr('class', 'container');
    this.links = this.container.append('g').attr('class', 'links');
    this.nodes = this.container.append('g').attr('class', 'nodes');

    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes && changes['data'] && !changes['data'].firstChange) ||
      changes['width'] ||
      changes['height'] ||
      changes['selectedNode'] ||
      changes['invalidEdges']
    ) {
      this.update();
    }
  }

  update(): void {
    const invalidLinkSet = new Set(this.invalidEdges?.map((edge) => `${edge.from}${edge.to}`));
    if (!this.svg || !this.container || !this.links || !this.nodes || !this.data || !this.margin) {
      return console.error('Missing svg, container, links or nodes');
    }

    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('cursor', 'move')
      .attr('viewBox', `-${this.margin?.left} -${this.margin?.top} ${this.width} ${this.height}`);
    this.container.attr('transform', null);

    const svg = d3_select('svg');
    const zoomFn: any = d3_zoom()
      .scaleExtent([0.7, 2])
      .on('zoom', function (event) {
        svg.selectAll('g').attr('transform', event.transform);
      });
    svg.call(zoomFn);

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
            .attr('stroke', (d) => (invalidLinkSet.has(`${d.source?.id}${d.target?.id}`) ? '#FF0000' : '#777771'))
            .style('opacity', 1)
            .style('mix-blend-mode', 'multiply');
        },
        (update) =>
          update
            .transition()
            .duration(300)
            .ease(easeQuadInOut)
            .attr('d', d3_sankeyLinkHorizontal())
            .attr('stroke-width', '5')
            .attr('stroke', (d) => (invalidLinkSet.has(`${d.source?.id}${d.target?.id}`) ? '#FF0000' : '#777771')),
        (exit) => exit.remove()
      );

    this.links
      .selectAll('rect')
      .data(this.data.links, (d: any) => `${d.target.id}${d.source.id}`)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', '#777771')
            .attr('width', 150)
            .attr('height', 30)
            .attr('rx', 8)
            .attr('x', (d) => (d.source.x1 + d.target.x0) / 2 - 75)
            .attr('y', (d) => (d.y0 + d.y1) / 2 - 15),
        (update) =>
          update
            .transition()
            .duration(300)
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
            .attr('fill', '#FFF'),
        (update) =>
          update
            .transition()
            .duration(300)
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
            .attr('fill', (d) => {
              if (d.id === this.invalidEdges?.find((edge) => edge.from === d.id || edge.to === d.id)) {
                return d.id === this.selectedNode ? '#ff6b6b' : '#FF0000';
              }

              return d.id === this.selectedNode ? '#bfcbad' : '#777771';
            })
            .attr('rx', 12)
            .attr('border-radius', '12px')
            .attr('cursor', 'pointer')
            .attr('opacity', 1),
        (update) =>
          update
            .transition()
            .duration(300)
            .ease(easeQuadInOut)
            .attr('x', (d) => d.x0 || 0)
            .attr('y', (d) => d.y0 - 75 || 0)
            .attr('fill', (d) => {
              if (this.invalidEdges && this.invalidEdges.find((edge) => edge.from === d.id || edge.to === d.id)) {
                return d.id === this.selectedNode ? '#ff6b6b' : '#FF0000';
              }

              return d.id === this.selectedNode ? '#bfcbad' : '#777771';
            })
            .attr('height', (d) => d.y1 - d.y0 + 150 || this.height)
            .attr('width', (d) => d.x1 - d.x0 || 50),
        (exit) => exit.remove()
      )
      .on('click', (event, data) => this.onMouseEnter(event, data));

    this.nodes
      .selectAll('text')
      .data(this.data.nodes, (d: any) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .text((d) => `${d.id}`)
            .attr('fill', (d) => (d.id === this.selectedNode ? '#000' : '#FFF'))
            .attr('font-weight', '500')
            .attr('text-anchor', 'middle')
            .attr('x', (d) => d.x0 + (d.x1 - d.x0) / 2 || 0)
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
            .duration(300)
            .ease(easeQuadInOut)
            .attr('fill', (d) => (d.id === this.selectedNode ? '#000' : '#FFF'))
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
      .on('click', (event, data) => this.onMouseEnter(event, data));
  }

  onMouseEnter(event: any, data: any) {
    const element = d3_select(event.target);
    this.nodeClick.emit((element.data()[0] as any).id);
  }
}

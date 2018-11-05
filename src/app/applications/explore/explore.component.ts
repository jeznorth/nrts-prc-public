import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurePurposeComponent } from './configure-purpose/configure-purpose.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  private ngbModal: NgbModalRef = null;
  
  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  public configurePurpose() {
    this.ngbModal = this.modalService.open(ConfigurePurposeComponent, {
      backdrop: 'static',
      size: 'lg'
    });
  }
  
}
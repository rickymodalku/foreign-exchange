// import { TestBed, async, ComponentFixture } from '@angular/core/testing';
// import { DebugElement } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';

// //Component
// import { BrowseLoanComponent } from './browse-loan.component';
// import { SGReverificationBannerComponent } from '../../components/reverification-banner/reverification-banner.component';
// import { SGRiskDisclosureComponent } from '../../components/risk-disclosure/risk-disclosure.component';
// import { SGSuitabilityAssessmentComponent } from '../../components/suitability-assessment/suitability-assessment.component';

// // Service
// import { LoanService } from '../../services/loan.service';
// import { AuthService } from '../../services/auth.service';
// import { FinanceService } from '../../services/finance.service';
// import { MemberService } from '../../services/member.service';
// import { DocumentService } from '../../services/document.service';
// import { NotificationService } from '../../services/notification.service';
// import { BaseParameterService } from '../../services/base-parameter.service';

// // Mock Service
// import { MockLoan } from '../../mock-services/loan-mock.service';
// import { MockAuth } from '../../mock-services/auth-mock.service';
// import { MockMember } from '../../mock-services/member-mock.service';
// import { MockDocument } from '../../mock-services/document-mock.service';
// import { MockFinance } from '../../mock-services/finance-mock.service';
// import { MockNotification } from '../../mock-services/notification-mock.service';
// import { TranslateServiceStub } from '../../mock-services/translate-mock.service';
// import { ActivatedRouteStub, routerSpy } from '../../mock-services/router-stub';

// // Module
// import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ModalModule } from '../../components/modal/modal.module';
// import { MatCheckboxModule } from '@angular/material/checkbox';

// describe('BrowseLoanComponent', () => {
//   let fixture: ComponentFixture<BrowseLoanComponent>;
//   let debugElement: DebugElement;
//   let loanService: LoanService;
//   let authService: AuthService;
//   let component: BrowseLoanComponent;
//   let activatedRoute: ActivatedRouteStub;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         BrowseLoanComponent,
//         SGReverificationBannerComponent,
//         SGRiskDisclosureComponent,
//         SGSuitabilityAssessmentComponent
//       ],
//       imports: [
//         TranslateModule,
//         FormsModule,
//         ReactiveFormsModule,
//         ModalModule,
//         MatCheckboxModule
//       ],
//       providers: [
//         { provide: LoanService, useClass: MockLoan },
//         { provide: AuthService, useClass: MockAuth },
//         { provide: MemberService, useClass: MockMember },
//         { provide: DocumentService, useClass: MockDocument },
//         { provide: FinanceService, useClass: MockFinance },
//         { provide: NotificationService, useClass: MockNotification },
//         { provide: TranslateService, useClass: TranslateServiceStub },
//         { provide: Router, useValue: routerSpy },
//         { provide: ActivatedRoute, useClass: ActivatedRouteStub },
//         BaseParameterService
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(BrowseLoanComponent);
//     debugElement = fixture.debugElement;
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(BrowseLoanComponent);
//     component = fixture.componentInstance;
//     loanService = TestBed.get(LoanService);
//     authService = TestBed.get(AuthService);
//     activatedRoute = TestBed.get(ActivatedRoute);
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

// })



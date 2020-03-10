import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import MockMemberService from '../../test-helper/mock-services/mock-member.service';
import MockFinanceService from '../../test-helper/mock-services/mock-finance.service';
import MockAuthService from '../../test-helper/mock-services/mock-auth.service';
import MockFeatureFlagService from '../../test-helper/mock-services/mock-feature-flag.service';
import MockNotifcationService from '../../test-helper/mock-services/mock-notification.service';
import MockUtilityService from '../../test-helper/mock-services/mock-utility.service';
import MockModalService from '../../test-helper/mock-services/mock-modal.service';
import MockMenuService from '../../test-helper/mock-services/mock-menu.service';
import MockBaseService from '../../test-helper/mock-services/mock-base.service';
import { TranslateTestingModule } from '../../test-helper/mock-modules/translate-testing.module';
// import { ActivatedRouteStub, routerSpy } from '../../test-helper/stub/router-stub';
import { MemberService } from 'app/services/member.service';
import { FinanceService } from 'app/services/finance.service';
import { MenuService } from 'app/services/menu.service';
import { AuthService } from 'app/services/auth.service';
import { BaseService } from 'app/services/base.service';
import { FeatureFlagService } from 'app/services/feature-flag.service';
import { BaseParameterService } from 'app/services/base-parameter.service';
import { UtilityService } from 'app/services/utility.service';
import { NotificationService } from 'app/services/notification.service';
import { ModalService } from 'app/services/modal.service';
import { LocalStorageService } from 'ngx-webstorage';


describe('investorDashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  // let activatedRoute: ActivatedRouteStub;
  let element: HTMLElement;
  let router;
  let route;
  const memberFakeData = {

  };
  const financeFakeData = {
    "value": {
      "summary": {
        "principal_Received": 1000,
        "interest_Received": 2000,
        "late_Interest_Received": 0,
        "early_Received": 0,
        "bonus_Received": 0,
        "service_Fees": 500,
        "total_income": 10000,
        "litigation_Fees": 0,
        "write_off": 0,
        "witholding_Tax": 0,
        "gst": 0,
        "portofolio_performance": 50.2,
        "deposit_Count": 2,
        "deposit_Amount": 2000000,
        "pending_balance": 0,
        "withdrawal_Count": 0,
        "withdrawal_Amount": 0,
        "pending_withdrawal": 0,
        "investment_Amount": 1000000,
        "pending_invest": 0,
        "total_charity": 0,
        "available_Balance": 2004263.83
      },
    }
  };
  const memberService = new MockMemberService({
    memberDetail: memberFakeData,
  });
  const financeService = new MockFinanceService({
    accountSummary: financeFakeData,
  });
  const authService = new MockAuthService({
    accountSummary: financeFakeData,
  });
  const featureFlagService = new MockFeatureFlagService({
    accountSummary: financeFakeData,
  });
  const utilityService = new MockUtilityService({
    accountSummary: financeFakeData,
  });
  const notificationService = new MockNotifcationService({
    errorMessage: 'akakakakaka',
  });
  const menuService = new MockMenuService({
    errorMessage: 'akakakakaka',
  });
  const modalService = new MockModalService({
  });
  const baseService = new MockBaseService({
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        DashboardComponent,
      ],
      providers: [
        { provide: MemberService, useValue: memberService },
        { provide: FinanceService, useValue: financeService },
        { provide: AuthService, useValue: authService },
        { provide: FeatureFlagService, useValue: featureFlagService },
        { provide: NotificationService, useValue: notificationService },
        { provide: BaseParameterService, useClass: BaseParameterService },
        { provide: LocalStorageService, useClass: BaseParameterService },
        { provide: UtilityService, useValue: utilityService },
        { provide: MenuService, useValue: menuService },
        { provide: ModalService, useValue: modalService },
        { provide: BaseService, useValue: baseService },
        // { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        // { provide: Router,useValue: routerSpy }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    // activatedRoute = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router)
    route = TestBed.get(ActivatedRoute)
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

})

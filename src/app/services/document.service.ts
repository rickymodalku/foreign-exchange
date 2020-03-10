
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    Http,
    Headers,
    Response,
    ResponseContentType,
    RequestOptionsArgs,
    RequestOptions
} from '@angular/http';
import CONFIGURATION from '../../configurations/configuration';
import { ENVIRONMENT } from '../../environments/environment';
import { NotificationService } from '../services/notification.service';
import { saveAs } from "file-saver";

@Injectable()
export class DocumentService {
    mimeTypes: Array<any>;

    constructor(
        private _http: Http,
        private _notificationService: NotificationService,
    ) {
        this.mimeTypes = new Array<any>();
        this._setMimeType('.ez', 'application/andrew-inset');
        this._setMimeType('.aw', 'application/applixware');
        this._setMimeType('.atom', 'application/atom+xml');
        this._setMimeType('.atomcat', 'application/atomcat+xml');
        this._setMimeType('.atomsvc', 'application/atomsvc+xml');
        this._setMimeType('.ccxml', 'application/ccxml+xml');
        this._setMimeType('.cu', 'application/cu-seeme');
        this._setMimeType('.davmount', 'application/davmount+xml');
        this._setMimeType('.ecma', 'application/ecmascript');
        this._setMimeType('.emma', 'application/emma+xml');
        this._setMimeType('.epub', 'application/epub+zip');
        this._setMimeType('.pfr', 'application/font-tdpfr');
        this._setMimeType('.stk', 'application/hyperstudio');
        this._setMimeType('.jar', 'application/java-archive');
        this._setMimeType('.ser', 'application/java-serialized-object');
        this._setMimeType('.class', 'application/java-vm');
        this._setMimeType('.js', 'application/javascript');
        this._setMimeType('.json', 'application/json');
        this._setMimeType('.lostxml', 'application/lost+xml');
        this._setMimeType('.hqx', 'application/mac-binhex40');
        this._setMimeType('.cpt', 'application/mac-compactpro');
        this._setMimeType('.mrc', 'application/marc');
        this._setMimeType('.ma,.nb,.mb', 'application/mathematica');
        this._setMimeType('.mathml', 'application/mathml+xml');
        this._setMimeType('.mbox', 'application/mbox');
        this._setMimeType('.mscml', 'application/mediaservercontrol+xml');
        this._setMimeType('.mp4s', 'application/mp4');
        this._setMimeType('.doc,.dot', 'application/msword');
        this._setMimeType('.mxf', 'application/mxf');
        this._setMimeType('.oda', 'application/oda');
        this._setMimeType('.opf', 'application/oebps-package+xml');
        this._setMimeType('.ogx', 'application/ogg');
        this._setMimeType('.onetoc,.onetoc2,.onetmp,.onepkg', 'application/onenote');
        this._setMimeType('.xer', 'application/patch-ops-error+xml');
        this._setMimeType('.pdf', 'application/pdf');
        this._setMimeType('.pgp', 'application/pgp-encrypted');
        this._setMimeType('.asc,.sig', 'application/pgp-signature');
        this._setMimeType('.prf', 'application/pics-rules');
        this._setMimeType('.p10', 'application/pkcs10');
        this._setMimeType('.p7m,.p7c', 'application/pkcs7-mime');
        this._setMimeType('.p7s', 'application/pkcs7-signature');
        this._setMimeType('.cer', 'application/pkix-cert');
        this._setMimeType('.crl', 'application/pkix-crl');
        this._setMimeType('.pkipath', 'application/pkix-pkipath');
        this._setMimeType('.pki', 'application/pkixcmp');
        this._setMimeType('.pls', 'application/pls+xml');
        this._setMimeType('.ai,.eps,.ps', 'application/postscript');
        this._setMimeType('.cww', 'application/prs.cww');
        this._setMimeType('.rdf', 'application/rdf+xml');
        this._setMimeType('.rif', 'application/reginfo+xml');
        this._setMimeType('.rnc', 'application/relax-ng-compact-syntax');
        this._setMimeType('.rl', 'application/resource-lists+xml');
        this._setMimeType('.rld', 'application/resource-lists-diff+xml');
        this._setMimeType('.rs', 'application/rls-services+xml');
        this._setMimeType('.rsd', 'application/rsd+xml');
        this._setMimeType('.rss', 'application/rss+xml');
        this._setMimeType('.rtf', 'application/rtf');
        this._setMimeType('.sbml', 'application/sbml+xml');
        this._setMimeType('.scq', 'application/scvp-cv-request');
        this._setMimeType('.scs', 'application/scvp-cv-response');
        this._setMimeType('.spq', 'application/scvp-vp-request');
        this._setMimeType('.spp', 'application/scvp-vp-response');
        this._setMimeType('.sdp', 'application/sdp');
        this._setMimeType('.setpay', 'application/set-payment-initiation');
        this._setMimeType('.setreg', 'application/set-registration-initiation');
        this._setMimeType('.shf', 'application/shf+xml');
        this._setMimeType('.smi,.smil', 'application/smil+xml');
        this._setMimeType('.rq', 'application/sparql-query');
        this._setMimeType('.srx', 'application/sparql-results+xml');
        this._setMimeType('.gram', 'application/srgs');
        this._setMimeType('.grxml', 'application/srgs+xml');
        this._setMimeType('.ssml', 'application/ssml+xml');
        this._setMimeType('.plb', 'application/vnd.3gpp.pic-bw-large');
        this._setMimeType('.psb', 'application/vnd.3gpp.pic-bw-small');
        this._setMimeType('.pvb', 'application/vnd.3gpp.pic-bw-var');
        this._setMimeType('.tcap', 'application/vnd.3gpp2.tcap');
        this._setMimeType('.pwn', 'application/vnd.3m.post-it-notes');
        this._setMimeType('.aso', 'application/vnd.accpac.simply.aso');
        this._setMimeType('.imp', 'application/vnd.accpac.simply.imp');
        this._setMimeType('.acu', 'application/vnd.acucobol');
        this._setMimeType('.atc,.acutc', 'application/vnd.acucorp');
        this._setMimeType('.air', 'application/vnd.adobe.air-application-installer-package+zip');
        this._setMimeType('.xdp', 'application/vnd.adobe.xdp+xml');
        this._setMimeType('.xfdf', 'application/vnd.adobe.xfdf');
        this._setMimeType('.azf', 'application/vnd.airzip.filesecure.azf');
        this._setMimeType('.azs', 'application/vnd.airzip.filesecure.azs');
        this._setMimeType('.azw', 'application/vnd.amazon.ebook');
        this._setMimeType('.acc', 'application/vnd.americandynamics.acc');
        this._setMimeType('.ami', 'application/vnd.amiga.ami');
        this._setMimeType('.apk', 'application/vnd.android.package-archive');
        this._setMimeType('.cii', 'application/vnd.anser-web-certificate-issue-initiation');
        this._setMimeType('.fti', 'application/vnd.anser-web-funds-transfer-initiation');
        this._setMimeType('.atx', 'application/vnd.antix.game-component');
        this._setMimeType('.mpkg', 'application/vnd.apple.installer+xml');
        this._setMimeType('.swi', 'application/vnd.arastra.swi');
        this._setMimeType('.aep', 'application/vnd.audiograph');
        this._setMimeType('.mpm', 'application/vnd.blueice.multipass');
        this._setMimeType('.bmi', 'application/vnd.bmi');
        this._setMimeType('.rep', 'application/vnd.businessobjects');
        this._setMimeType('.cdxml', 'application/vnd.chemdraw+xml');
        this._setMimeType('.mmd', 'application/vnd.chipnuts.karaoke-mmd');
        this._setMimeType('.cdy', 'application/vnd.cinderella');
        this._setMimeType('.cla', 'application/vnd.claymore');
        this._setMimeType('.c4g,.c4d,.c4f,.c4p,.c4u', 'application/vnd.clonk.c4group');
        this._setMimeType('.csp', 'application/vnd.commonspace');
        this._setMimeType('.cdbcmsg', 'application/vnd.contact.cmsg');
        this._setMimeType('.cmc', 'application/vnd.cosmocaller');
        this._setMimeType('.clkx', 'application/vnd.crick.clicker');
        this._setMimeType('.clkk', 'application/vnd.crick.clicker.keyboard');
        this._setMimeType('.clkp', 'application/vnd.crick.clicker.paconstte');
        this._setMimeType('.clkt', 'application/vnd.crick.clicker.template');
        this._setMimeType('.clkw', 'application/vnd.crick.clicker.wordbank');
        this._setMimeType('.wbs', 'application/vnd.criticaltools.wbs+xml');
        this._setMimeType('.pml', 'application/vnd.ctc-posml');
        this._setMimeType('.ppd', 'application/vnd.cups-ppd');
        this._setMimeType('.car', 'application/vnd.curl.car');
        this._setMimeType('.pcurl', 'application/vnd.curl.pcurl');
        this._setMimeType('.rdz', 'application/vnd.data-vision.rdz');
        this._setMimeType('.fe_launch', 'application/vnd.denovo.fcselayout-link');
        this._setMimeType('.dna', 'application/vnd.dna');
        this._setMimeType('.mlp', 'application/vnd.dolby.mlp');
        this._setMimeType('.dpg', 'application/vnd.dpgraph');
        this._setMimeType('.dfac', 'application/vnd.dreamfactory');
        this._setMimeType('.geo', 'application/vnd.dynageo');
        this._setMimeType('.mag', 'application/vnd.ecowin.chart');
        this._setMimeType('.nml', 'application/vnd.enliven');
        this._setMimeType('.esf', 'application/vnd.epson.esf');
        this._setMimeType('.msf', 'application/vnd.epson.msf');
        this._setMimeType('.qam', 'application/vnd.epson.quickanime');
        this._setMimeType('.slt', 'application/vnd.epson.salt');
        this._setMimeType('.ssf', 'application/vnd.epson.ssf');
        this._setMimeType('.es3,.et3', 'application/vnd.eszigno3+xml');
        this._setMimeType('.ez2', 'application/vnd.ezpix-album');
        this._setMimeType('.ez3', 'application/vnd.ezpix-package');
        this._setMimeType('.fdf', 'application/vnd.fdf');
        this._setMimeType('.mseed', 'application/vnd.fdsn.mseed');
        this._setMimeType('.seed,.dataless', 'application/vnd.fdsn.seed');
        this._setMimeType('.gph', 'application/vnd.flographit');
        this._setMimeType('.ftc', 'application/vnd.fluxtime.clip');
        this._setMimeType('.fm,.frame,.maker,.book', 'application/vnd.framemaker');
        this._setMimeType('.fnc', 'application/vnd.frogans.fnc');
        this._setMimeType('.ltf', 'application/vnd.frogans.ltf');
        this._setMimeType('.fsc', 'application/vnd.fsc.weblaunch');
        this._setMimeType('.oas', 'application/vnd.fujitsu.oasys');
        this._setMimeType('.oa2', 'application/vnd.fujitsu.oasys2');
        this._setMimeType('.oa3', 'application/vnd.fujitsu.oasys3');
        this._setMimeType('.fg5', 'application/vnd.fujitsu.oasysgp');
        this._setMimeType('.bh2', 'application/vnd.fujitsu.oasysprs');
        this._setMimeType('.ddd', 'application/vnd.fujixerox.ddd');
        this._setMimeType('.xdw', 'application/vnd.fujixerox.docuworks');
        this._setMimeType('.xbd', 'application/vnd.fujixerox.docuworks.binder');
        this._setMimeType('.fzs', 'application/vnd.fuzzysheet');
        this._setMimeType('.txd', 'application/vnd.genomatix.tuxedo');
        this._setMimeType('.ggb', 'application/vnd.geogebra.file');
        this._setMimeType('.ggt', 'application/vnd.geogebra.tool');
        this._setMimeType('.gex,.gre', 'application/vnd.geometry-explorer');
        this._setMimeType('.gmx', 'application/vnd.gmx');
        this._setMimeType('.kml', 'application/vnd.google-earth.kml+xml');
        this._setMimeType('.kmz', 'application/vnd.google-earth.kmz');
        this._setMimeType('.gqf,.gqs', 'application/vnd.grafeq');
        this._setMimeType('.gac', 'application/vnd.groove-account');
        this._setMimeType('.ghf', 'application/vnd.groove-help');
        this._setMimeType('.gim', 'application/vnd.groove-identity-message');
        this._setMimeType('.grv', 'application/vnd.groove-injector');
        this._setMimeType('.gtm', 'application/vnd.groove-tool-message');
        this._setMimeType('.tpl', 'application/vnd.groove-tool-template');
        this._setMimeType('.vcg', 'application/vnd.groove-vcard');
        this._setMimeType('.zmm', 'application/vnd.handheld-entertainment+xml');
        this._setMimeType('.hbci', 'application/vnd.hbci');
        this._setMimeType('.les', 'application/vnd.hhe.lesson-player');
        this._setMimeType('.hpgl', 'application/vnd.hp-hpgl');
        this._setMimeType('.hpid', 'application/vnd.hp-hpid');
        this._setMimeType('.hps', 'application/vnd.hp-hps');
        this._setMimeType('.jlt', 'application/vnd.hp-jlyt');
        this._setMimeType('.pcl', 'application/vnd.hp-pcl');
        this._setMimeType('.pclxl', 'application/vnd.hp-pclxl');
        this._setMimeType('.sfd-hdstx', 'application/vnd.hydrostatix.sof-data');
        this._setMimeType('.x3d', 'application/vnd.hzn-3d-crossword');
        this._setMimeType('.mpy', 'application/vnd.ibm.minipay');
        this._setMimeType('.afp,.listafp,.list3820', 'application/vnd.ibm.modcap');
        this._setMimeType('.irm', 'application/vnd.ibm.rights-management');
        this._setMimeType('.sc', 'application/vnd.ibm.secure-container');
        this._setMimeType('.icc,.icm', 'application/vnd.iccprofile');
        this._setMimeType('.igl', 'application/vnd.igloader');
        this._setMimeType('.ivp', 'application/vnd.immervision-ivp');
        this._setMimeType('.ivu', 'application/vnd.immervision-ivu');
        this._setMimeType('.xpw,.xpx', 'application/vnd.intercon.formnet');
        this._setMimeType('.qbo', 'application/vnd.intu.qbo');
        this._setMimeType('.qfx', 'application/vnd.intu.qfx');
        this._setMimeType('.rcprofile', 'application/vnd.ipunplugged.rcprofile');
        this._setMimeType('.irp', 'application/vnd.irepository.package+xml');
        this._setMimeType('.xpr', 'application/vnd.is-xpr');
        this._setMimeType('.jam', 'application/vnd.jam');
        this._setMimeType('.rms', 'application/vnd.jcp.javame.midconst-rms');
        this._setMimeType('.jisp', 'application/vnd.jisp');
        this._setMimeType('.joda', 'application/vnd.joost.joda-archive');
        this._setMimeType('.ktz,.ktr', 'application/vnd.kahootz');
        this._setMimeType('.karbon', 'application/vnd.kde.karbon');
        this._setMimeType('.chrt', 'application/vnd.kde.kchart');
        this._setMimeType('.kfo', 'application/vnd.kde.kformula');
        this._setMimeType('.flw', 'application/vnd.kde.kivio');
        this._setMimeType('.kon', 'application/vnd.kde.kontour');
        this._setMimeType('.kpr,.kpt', 'application/vnd.kde.kpresenter');
        this._setMimeType('.ksp', 'application/vnd.kde.kspread');
        this._setMimeType('.kwd,.kwt', 'application/vnd.kde.kword');
        this._setMimeType('.htke', 'application/vnd.kenameaapp');
        this._setMimeType('.kia', 'application/vnd.kidspiration');
        this._setMimeType('.kne,.knp', 'application/vnd.kinar');
        this._setMimeType('.skp,.skd,.skt,.skm', 'application/vnd.koan');
        this._setMimeType('.sse', 'application/vnd.kodak-descriptor');
        this._setMimeType('.lbd', 'application/vnd.llamagraphics.life-balance.desktop');
        this._setMimeType('.lbe', 'application/vnd.llamagraphics.life-balance.exchange+xml');
        this._setMimeType('.123', 'application/vnd.lotus-1-2-3');
        this._setMimeType('.apr', 'application/vnd.lotus-approach');
        this._setMimeType('.pre', 'application/vnd.lotus-freelance');
        this._setMimeType('.nsf', 'application/vnd.lotus-notes');
        this._setMimeType('.org', 'application/vnd.lotus-organizer');
        this._setMimeType('.scm', 'application/vnd.lotus-screencam');
        this._setMimeType('.lwp', 'application/vnd.lotus-wordpro');
        this._setMimeType('.portpkg', 'application/vnd.macports.portpkg');
        this._setMimeType('.mcd', 'application/vnd.mcd');
        this._setMimeType('.mc1', 'application/vnd.medcalcdata');
        this._setMimeType('.cdkey', 'application/vnd.mediastation.cdkey');
        this._setMimeType('.mwf', 'application/vnd.mfer');
        this._setMimeType('.mfm', 'application/vnd.mfmp');
        this._setMimeType('.flo', 'application/vnd.micrografx.flo');
        this._setMimeType('.igx', 'application/vnd.micrografx.igx');
        this._setMimeType('.mif', 'application/vnd.mif');
        this._setMimeType('.daf', 'application/vnd.mobius.daf');
        this._setMimeType('.dis', 'application/vnd.mobius.dis');
        this._setMimeType('.mbk', 'application/vnd.mobius.mbk');
        this._setMimeType('.mqy', 'application/vnd.mobius.mqy');
        this._setMimeType('.msl', 'application/vnd.mobius.msl');
        this._setMimeType('.plc', 'application/vnd.mobius.plc');
        this._setMimeType('.txf', 'application/vnd.mobius.txf');
        this._setMimeType('.mpn', 'application/vnd.mophun.application');
        this._setMimeType('.mpc', 'application/vnd.mophun.certificate');
        this._setMimeType('.xul', 'application/vnd.mozilla.xul+xml');
        this._setMimeType('.cil', 'application/vnd.ms-artgalry');
        this._setMimeType('.cab', 'application/vnd.ms-cab-compressed');
        this._setMimeType('.xls,.xlm,.xla,.xlc,.xlt,.xlw', 'application/vnd.ms-excel');
        this._setMimeType('.xlam', 'application/vnd.ms-excel.addin.macroenabled.12');
        this._setMimeType('.xlsb', 'application/vnd.ms-excel.sheet.binary.macroenabled.12');
        this._setMimeType('.xlsm', 'application/vnd.ms-excel.sheet.macroenabled.12');
        this._setMimeType('.xltm', 'application/vnd.ms-excel.template.macroenabled.12');
        this._setMimeType('.eot', 'application/vnd.ms-fontobject');
        this._setMimeType('.chm', 'application/vnd.ms-htmlhelp');
        this._setMimeType('.ims', 'application/vnd.ms-ims');
        this._setMimeType('.lrm', 'application/vnd.ms-lrm');
        this._setMimeType('.cat', 'application/vnd.ms-pki.seccat');
        this._setMimeType('.stl', 'application/vnd.ms-pki.stl');
        this._setMimeType('.ppt,.pps,.pot', 'application/vnd.ms-powerpoint');
        this._setMimeType('.ppam', 'application/vnd.ms-powerpoint.addin.macroenabled.12');
        this._setMimeType('.pptm', 'application/vnd.ms-powerpoint.presentation.macroenabled.12');
        this._setMimeType('.sldm', 'application/vnd.ms-powerpoint.slide.macroenabled.12');
        this._setMimeType('.ppsm', 'application/vnd.ms-powerpoint.slideshow.macroenabled.12');
        this._setMimeType('.potm', 'application/vnd.ms-powerpoint.template.macroenabled.12');
        this._setMimeType('.mpp,.mpt', 'application/vnd.ms-project');
        this._setMimeType('.docm', 'application/vnd.ms-word.document.macroenabled.12');
        this._setMimeType('.dotm', 'application/vnd.ms-word.template.macroenabled.12');
        this._setMimeType('.wps,.wks,.wcm,.wdb', 'application/vnd.ms-works');
        this._setMimeType('.wpl', 'application/vnd.ms-wpl');
        this._setMimeType('.xps', 'application/vnd.ms-xpsdocument');
        this._setMimeType('.mseq', 'application/vnd.mseq');
        this._setMimeType('.mus', 'application/vnd.musician');
        this._setMimeType('.msty', 'application/vnd.muvee.style');
        this._setMimeType('.nlu', 'application/vnd.neurolanguage.nlu');
        this._setMimeType('.nnd', 'application/vnd.noblenet-directory');
        this._setMimeType('.nns', 'application/vnd.noblenet-sealer');
        this._setMimeType('.nnw', 'application/vnd.noblenet-web');
        this._setMimeType('.ngdat', 'application/vnd.nokia.n-gage.data');
        this._setMimeType('.n-gage', 'application/vnd.nokia.n-gage.symbian.install');
        this._setMimeType('.rpst', 'application/vnd.nokia.radio-preset');
        this._setMimeType('.rpss', 'application/vnd.nokia.radio-presets');
        this._setMimeType('.edm', 'application/vnd.novadigm.edm');
        this._setMimeType('.edx', 'application/vnd.novadigm.edx');
        this._setMimeType('.ext', 'application/vnd.novadigm.ext');
        this._setMimeType('.odc', 'application/vnd.oasis.opendocument.chart');
        this._setMimeType('.otc', 'application/vnd.oasis.opendocument.chart-template');
        this._setMimeType('.odb', 'application/vnd.oasis.opendocument.database');
        this._setMimeType('.odf', 'application/vnd.oasis.opendocument.formula');
        this._setMimeType('.odft', 'application/vnd.oasis.opendocument.formula-template');
        this._setMimeType('.odg', 'application/vnd.oasis.opendocument.graphics');
        this._setMimeType('.otg', 'application/vnd.oasis.opendocument.graphics-template');
        this._setMimeType('.odi', 'application/vnd.oasis.opendocument.image');
        this._setMimeType('.oti', 'application/vnd.oasis.opendocument.image-template');
        this._setMimeType('.odp', 'application/vnd.oasis.opendocument.presentation');
        this._setMimeType('.ods', 'application/vnd.oasis.opendocument.spreadsheet');
        this._setMimeType('.ots', 'application/vnd.oasis.opendocument.spreadsheet-template');
        this._setMimeType('.odt', 'application/vnd.oasis.opendocument.text');
        this._setMimeType('.otm', 'application/vnd.oasis.opendocument.text-master');
        this._setMimeType('.ott', 'application/vnd.oasis.opendocument.text-template');
        this._setMimeType('.oth', 'application/vnd.oasis.opendocument.text-web');
        this._setMimeType('.xo', 'application/vnd.olpc-sugar');
        this._setMimeType('.dd2', 'application/vnd.oma.dd2+xml');
        this._setMimeType('.oxt', 'application/vnd.openofficeorg.extension');
        this._setMimeType('.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        this._setMimeType('.sldx', 'application/vnd.openxmlformats-officedocument.presentationml.slide');
        this._setMimeType('.ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow');
        this._setMimeType('.potx', 'application/vnd.openxmlformats-officedocument.presentationml.template');
        this._setMimeType('.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this._setMimeType('.xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template');
        this._setMimeType('.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        this._setMimeType('.dotx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template');
        this._setMimeType('.dp', 'application/vnd.osgi.dp');
        this._setMimeType('.pdb,.pqa,.oprc', 'application/vnd.palm');
        this._setMimeType('.str', 'application/vnd.pg.format');
        this._setMimeType('.ei6', 'application/vnd.pg.osasli');
        this._setMimeType('.efif', 'application/vnd.picsel');
        this._setMimeType('.plf', 'application/vnd.pocketlearn');
        this._setMimeType('.pbd', 'application/vnd.powerbuilder6');
        this._setMimeType('.box', 'application/vnd.previewsystems.box');
        this._setMimeType('.mgz', 'application/vnd.proteus.magazine');
        this._setMimeType('.qps', 'application/vnd.publishare-delta-tree');
        this._setMimeType('.ptid', 'application/vnd.pvi.ptid1');
        this._setMimeType('.qxd,.qxt,.qwd,.qwt,.qxl,.qxb', 'application/vnd.quark.quarkxpress');
        this._setMimeType('.mxl', 'application/vnd.recordare.musicxml');
        this._setMimeType('.musicxml', 'application/vnd.recordare.musicxml+xml');
        this._setMimeType('.cod', 'application/vnd.rim.cod');
        this._setMimeType('.rm', 'application/vnd.rn-realmedia');
        this._setMimeType('.link66', 'application/vnd.route66.link66+xml');
        this._setMimeType('.see', 'application/vnd.seemail');
        this._setMimeType('.sema', 'application/vnd.sema');
        this._setMimeType('.semd', 'application/vnd.semd');
        this._setMimeType('.semf', 'application/vnd.semf');
        this._setMimeType('.ifm', 'application/vnd.shana.informed.formdata');
        this._setMimeType('.itp', 'application/vnd.shana.informed.formtemplate');
        this._setMimeType('.iif', 'application/vnd.shana.informed.interchange');
        this._setMimeType('.ipk', 'application/vnd.shana.informed.package');
        this._setMimeType('.twd,.twds', 'application/vnd.simtech-mindmapper');
        this._setMimeType('.mmf', 'application/vnd.smaf');
        this._setMimeType('.teacher', 'application/vnd.smart.teacher');
        this._setMimeType('.sdkm,.sdkd', 'application/vnd.solent.sdkm+xml');
        this._setMimeType('.dxp', 'application/vnd.spotfire.dxp');
        this._setMimeType('.sfs', 'application/vnd.spotfire.sfs');
        this._setMimeType('.sdc', 'application/vnd.stardivision.calc');
        this._setMimeType('.sda', 'application/vnd.stardivision.draw');
        this._setMimeType('.sdd', 'application/vnd.stardivision.impress');
        this._setMimeType('.smf', 'application/vnd.stardivision.math');
        this._setMimeType('.sdw', 'application/vnd.stardivision.writer');
        this._setMimeType('.vor', 'application/vnd.stardivision.writer');
        this._setMimeType('.sgl', 'application/vnd.stardivision.writer-global');
        this._setMimeType('.sxc', 'application/vnd.sun.xml.calc');
        this._setMimeType('.stc', 'application/vnd.sun.xml.calc.template');
        this._setMimeType('.sxd', 'application/vnd.sun.xml.draw');
        this._setMimeType('.std', 'application/vnd.sun.xml.draw.template');
        this._setMimeType('.sxi', 'application/vnd.sun.xml.impress');
        this._setMimeType('.sti', 'application/vnd.sun.xml.impress.template');
        this._setMimeType('.sxm', 'application/vnd.sun.xml.math');
        this._setMimeType('.sxw', 'application/vnd.sun.xml.writer');
        this._setMimeType('.sxg', 'application/vnd.sun.xml.writer.global');
        this._setMimeType('.stw', 'application/vnd.sun.xml.writer.template');
        this._setMimeType('.sus,.susp', 'application/vnd.sus-calendar');
        this._setMimeType('.svd', 'application/vnd.svd');
        this._setMimeType('.sis,.sisx', 'application/vnd.symbian.install');
        this._setMimeType('.xsm', 'application/vnd.syncml+xml');
        this._setMimeType('.bdm', 'application/vnd.syncml.dm+wbxml');
        this._setMimeType('.xdm', 'application/vnd.syncml.dm+xml');
        this._setMimeType('.tao', 'application/vnd.tao.intent-module-archive');
        this._setMimeType('.tmo', 'application/vnd.tmobile-livetv');
        this._setMimeType('.tpt', 'application/vnd.trid.tpt');
        this._setMimeType('.mxs', 'application/vnd.triscape.mxs');
        this._setMimeType('.tra', 'application/vnd.trueapp');
        this._setMimeType('.ufd,.ufdl', 'application/vnd.ufdl');
        this._setMimeType('.utz', 'application/vnd.uiq.theme');
        this._setMimeType('.umj', 'application/vnd.umajin');
        this._setMimeType('.unityweb', 'application/vnd.unity');
        this._setMimeType('.uoml', 'application/vnd.uoml+xml');
        this._setMimeType('.vcx', 'application/vnd.vcx');
        this._setMimeType('.vsd,.vst,.vss,.vsw', 'application/vnd.visio');
        this._setMimeType('.vis', 'application/vnd.visionary');
        this._setMimeType('.vsf', 'application/vnd.vsf');
        this._setMimeType('.wbxml', 'application/vnd.wap.wbxml');
        this._setMimeType('.wmlc', 'application/vnd.wap.wmlc');
        this._setMimeType('.wmlsc', 'application/vnd.wap.wmlscriptc');
        this._setMimeType('.wtb', 'application/vnd.webturbo');
        this._setMimeType('.wpd', 'application/vnd.wordperfect');
        this._setMimeType('.wqd', 'application/vnd.wqd');
        this._setMimeType('.stf', 'application/vnd.wt.stf');
        this._setMimeType('.xar', 'application/vnd.xara');
        this._setMimeType('.xfdl', 'application/vnd.xfdl');
        this._setMimeType('.hvd', 'application/vnd.yamaha.hv-dic');
        this._setMimeType('.hvs', 'application/vnd.yamaha.hv-script');
        this._setMimeType('.hvp', 'application/vnd.yamaha.hv-voice');
        this._setMimeType('.osf', 'application/vnd.yamaha.openscoreformat');
        this._setMimeType('.osfpvg', 'application/vnd.yamaha.openscoreformat.osfpvg+xml');
        this._setMimeType('.saf', 'application/vnd.yamaha.smaf-audio');
        this._setMimeType('.spf', 'application/vnd.yamaha.smaf-phrase');
        this._setMimeType('.cmp', 'application/vnd.yellowriver-custom-menu');
        this._setMimeType('.zir,.zirz', 'application/vnd.zul');
        this._setMimeType('.zaz', 'application/vnd.zzazz.deck+xml');
        this._setMimeType('.vxml', 'application/voicexml+xml');
        this._setMimeType('.hlp', 'application/winhlp');
        this._setMimeType('.wsdl', 'application/wsdl+xml');
        this._setMimeType('.wspolicy', 'application/wspolicy+xml');
        this._setMimeType('.abw', 'application/x-abiword');
        this._setMimeType('.ace', 'application/x-ace-compressed');
        this._setMimeType('.aab,.x32,.u32,.vox', 'application/x-authorware-bin');
        this._setMimeType('.aam', 'application/x-authorware-map');
        this._setMimeType('.aas', 'application/x-authorware-seg');
        this._setMimeType('.bcpio', 'application/x-bcpio');
        this._setMimeType('.torrent', 'application/x-bittorrent');
        this._setMimeType('.bz', 'application/x-bzip');
        this._setMimeType('.bz2,.boz', 'application/x-bzip2');
        this._setMimeType('.vcd', 'application/x-cdlink');
        this._setMimeType('.chat', 'application/x-chat');
        this._setMimeType('.pgn', 'application/x-chess-pgn');
        this._setMimeType('.cpio', 'application/x-cpio');
        this._setMimeType('.csh', 'application/x-csh');
        this._setMimeType('.deb,.udeb', 'application/x-debian-package');
        this._setMimeType('.dir,.dcr,.dxr,.cst,.cct,.cxt,.w3d,.fgd,.swa', 'application/x-director');
        this._setMimeType('.wad', 'application/x-doom');
        this._setMimeType('.ncx', 'application/x-dtbncx+xml');
        this._setMimeType('.dtb', 'application/x-dtbook+xml');
        this._setMimeType('.res', 'application/x-dtbresource+xml');
        this._setMimeType('.dvi', 'application/x-dvi');
        this._setMimeType('.bdf', 'application/x-font-bdf');
        this._setMimeType('.gsf', 'application/x-font-ghostscript');
        this._setMimeType('.psf', 'application/x-font-linux-psf');
        this._setMimeType('.otf', 'application/x-font-otf');
        this._setMimeType('.pcf', 'application/x-font-pcf');
        this._setMimeType('.snf', 'application/x-font-snf');
        this._setMimeType('.ttf,.ttc', 'application/x-font-ttf');
        this._setMimeType('.woff', 'application/font-woff');
        this._setMimeType('.pfa,.pfb,.pfm,.afm', 'application/x-font-type1');
        this._setMimeType('.spl', 'application/x-futuresplash');
        this._setMimeType('.gnumeric', 'application/x-gnumeric');
        this._setMimeType('.gtar', 'application/x-gtar');
        this._setMimeType('.hdf', 'application/x-hdf');
        this._setMimeType('.jnlp', 'application/x-java-jnlp-file');
        this._setMimeType('.latex', 'application/x-latex');
        this._setMimeType('.prc,.mobi', 'application/x-mobipocket-ebook');
        this._setMimeType('.application', 'application/x-ms-application');
        this._setMimeType('.wmd', 'application/x-ms-wmd');
        this._setMimeType('.wmz', 'application/x-ms-wmz');
        this._setMimeType('.xbap', 'application/x-ms-xbap');
        this._setMimeType('.mdb', 'application/x-msaccess');
        this._setMimeType('.obd', 'application/x-msbinder');
        this._setMimeType('.crd', 'application/x-mscardfile');
        this._setMimeType('.clp', 'application/x-msclip');
        this._setMimeType('.exe,.dll,.com,.bat,.msi', 'application/x-msdownload');
        this._setMimeType('.mvb,.m13,.m14', 'application/x-msmediaview');
        this._setMimeType('.wmf', 'application/x-msmetafile');
        this._setMimeType('.mny', 'application/x-msmoney');
        this._setMimeType('.pub', 'application/x-mspublisher');
        this._setMimeType('.scd', 'application/x-msschedule');
        this._setMimeType('.trm', 'application/x-msterminal');
        this._setMimeType('.wri', 'application/x-mswrite');
        this._setMimeType('.nc,.cdf', 'application/x-netcdf');
        this._setMimeType('.p12,.pfx', 'application/x-pkcs12');
        this._setMimeType('.p7b,.spc', 'application/x-pkcs7-certificates');
        this._setMimeType('.p7r', 'application/x-pkcs7-certreqresp');
        this._setMimeType('.rar', 'application/x-rar-compressed');
        this._setMimeType('.sh', 'application/x-sh');
        this._setMimeType('.shar', 'application/x-shar');
        this._setMimeType('.swf', 'application/x-shockwave-flash');
        this._setMimeType('.xap', 'application/x-silverlight-app');
        this._setMimeType('.sit', 'application/x-stuffit');
        this._setMimeType('.sitx', 'application/x-stuffitx');
        this._setMimeType('.sv4cpio', 'application/x-sv4cpio');
        this._setMimeType('.sv4crc', 'application/x-sv4crc');
        this._setMimeType('.tar', 'application/x-tar');
        this._setMimeType('.tcl', 'application/x-tcl');
        this._setMimeType('.tex', 'application/x-tex');
        this._setMimeType('.tfm', 'application/x-tex-tfm');
        this._setMimeType('.texinfo,.texi', 'application/x-texinfo');
        this._setMimeType('.ustar', 'application/x-ustar');
        this._setMimeType('.src', 'application/x-wais-source');
        this._setMimeType('.der,.crt', 'application/x-x509-ca-cert');
        this._setMimeType('.fig', 'application/x-xfig');
        this._setMimeType('.xpi', 'application/x-xpinstall');
        this._setMimeType('.xenc', 'application/xenc+xml');
        this._setMimeType('.xhtml,.xht', 'application/xhtml+xml');
        this._setMimeType('.xml,.xsl', 'application/xml');
        this._setMimeType('.dtd', 'application/xml-dtd');
        this._setMimeType('.xop', 'application/xop+xml');
        this._setMimeType('.xslt', 'application/xslt+xml');
        this._setMimeType('.xspf', 'application/xspf+xml');
        this._setMimeType('.mxml,.xhvml,.xvml,.xvm', 'application/xv+xml');
        this._setMimeType('.zip', 'application/zip');
        this._setMimeType('.adp', 'audio/adpcm');
        this._setMimeType('.au,.snd', 'audio/basic');
        this._setMimeType('.mid,.midi,.kar,.rmi', 'audio/midi');
        this._setMimeType('.mp4a', 'audio/mp4');
        this._setMimeType('.m4a,.m4p', 'audio/mp4a-latm');
        this._setMimeType('.mpga,.mp2,.mp2a,.mp3,.m2a,.m3a', 'audio/mpeg');
        this._setMimeType('.oga,.ogg,.spx', 'audio/ogg');
        this._setMimeType('.eol', 'audio/vnd.digital-winds');
        this._setMimeType('.dts', 'audio/vnd.dts');
        this._setMimeType('.dtshd', 'audio/vnd.dts.hd');
        this._setMimeType('.lvp', 'audio/vnd.lucent.voice');
        this._setMimeType('.pya', 'audio/vnd.ms-playready.media.pya');
        this._setMimeType('.ecelp4800', 'audio/vnd.nuera.ecelp4800');
        this._setMimeType('.ecelp7470', 'audio/vnd.nuera.ecelp7470');
        this._setMimeType('.ecelp9600', 'audio/vnd.nuera.ecelp9600');
        this._setMimeType('.aac', 'audio/x-aac');
        this._setMimeType('.aif,.aiff,.aifc', 'audio/x-aiff');
        this._setMimeType('.m3u', 'audio/x-mpegurl');
        this._setMimeType('.wax', 'audio/x-ms-wax');
        this._setMimeType('.wma', 'audio/x-ms-wma');
        this._setMimeType('.ram,.ra', 'audio/x-pn-realaudio');
        this._setMimeType('.rmp', 'audio/x-pn-realaudio-plugin');
        this._setMimeType('.wav', 'audio/x-wav');
        this._setMimeType('.cdx', 'chemical/x-cdx');
        this._setMimeType('.cif', 'chemical/x-cif');
        this._setMimeType('.cmdf', 'chemical/x-cmdf');
        this._setMimeType('.cml', 'chemical/x-cml');
        this._setMimeType('.csml', 'chemical/x-csml');
        this._setMimeType('.xyz', 'chemical/x-xyz');
        this._setMimeType('.bmp', 'image/bmp');
        this._setMimeType('.cgm', 'image/cgm');
        this._setMimeType('.g3', 'image/g3fax');
        this._setMimeType('.gif', 'image/gif');
        this._setMimeType('.ief', 'image/ief');
        this._setMimeType('.jp2', 'image/jp2');
        this._setMimeType('.jpeg,.jpg,.jpe', 'image/jpeg');
        this._setMimeType('.pict,.pic,.pct', 'image/pict');
        this._setMimeType('.png', 'image/png');
        this._setMimeType('.btif', 'image/prs.btif');
        this._setMimeType('.svg,.svgz', 'image/svg+xml');
        this._setMimeType('.tiff,.tif', 'image/tiff');
        this._setMimeType('.psd', 'image/vnd.adobe.photoshop');
        this._setMimeType('.djvu,.djv', 'image/vnd.djvu');
        this._setMimeType('.dwg', 'image/vnd.dwg');
        this._setMimeType('.dxf', 'image/vnd.dxf');
        this._setMimeType('.fbs', 'image/vnd.fastbidsheet');
        this._setMimeType('.fpx', 'image/vnd.fpx');
        this._setMimeType('.fst', 'image/vnd.fst');
        this._setMimeType('.mmr', 'image/vnd.fujixerox.edmics-mmr');
        this._setMimeType('.rlc', 'image/vnd.fujixerox.edmics-rlc');
        this._setMimeType('.mdi', 'image/vnd.ms-modi');
        this._setMimeType('.npx', 'image/vnd.net-fpx');
        this._setMimeType('.wbmp', 'image/vnd.wap.wbmp');
        this._setMimeType('.xif', 'image/vnd.xiff');
        this._setMimeType('.ras', 'image/x-cmu-raster');
        this._setMimeType('.cmx', 'image/x-cmx');
        this._setMimeType('.fh,.fhc,.fh4,.fh5,.fh7', 'image/x-freehand');
        this._setMimeType('.ico', 'image/x-icon');
        this._setMimeType('.pntg,.pnt,.mac', 'image/x-macpaint');
        this._setMimeType('.pcx', 'image/x-pcx');
        this._setMimeType('.pnm', 'image/x-portable-anymap');
        this._setMimeType('.pbm', 'image/x-portable-bitmap');
        this._setMimeType('.pgm', 'image/x-portable-graymap');
        this._setMimeType('.ppm', 'image/x-portable-pixmap');
        this._setMimeType('.qtif,.qti', 'image/x-quicktime');
        this._setMimeType('.rgb', 'image/x-rgb');
        this._setMimeType('.xbm', 'image/x-xbitmap');
        this._setMimeType('.xpm', 'image/x-xpixmap');
        this._setMimeType('.xwd', 'image/x-xwindowdump');
        this._setMimeType('.eml,.mime', 'message/rfc822');
        this._setMimeType('.igs,.iges', 'model/iges');
        this._setMimeType('.msh,.mesh,.silo', 'model/mesh');
        this._setMimeType('.dwf', 'model/vnd.dwf');
        this._setMimeType('.gdl', 'model/vnd.gdl');
        this._setMimeType('.gtw', 'model/vnd.gtw');
        this._setMimeType('.mts', 'model/vnd.mts');
        this._setMimeType('.vtu', 'model/vnd.vtu');
        this._setMimeType('.wrl,.vrml', 'model/vrml');
        this._setMimeType('.ics,.ifb', 'text/calendar');
        this._setMimeType('.css', 'text/css');
        this._setMimeType('.csv', 'text/csv');
        this._setMimeType('.html,.htm', 'text/html');
        this._setMimeType('.txt,.text,.conf,.def,.list,.log,.in', 'text/plain');
        this._setMimeType('.dsc', 'text/prs.lines.tag');
        this._setMimeType('.rtx', 'text/richtext');
        this._setMimeType('.sgml,.sgm', 'text/sgml');
        this._setMimeType('.tsv', 'text/tab-separated-values');
        this._setMimeType('.t,.tr,.roff,.man,.me,.ms', 'text/troff');
        this._setMimeType('.uri,.uris,.urls', 'text/uri-list');
        this._setMimeType('.curl', 'text/vnd.curl');
        this._setMimeType('.dcurl', 'text/vnd.curl.dcurl');
        this._setMimeType('.scurl', 'text/vnd.curl.scurl');
        this._setMimeType('.mcurl', 'text/vnd.curl.mcurl');
        this._setMimeType('.fly', 'text/vnd.fly');
        this._setMimeType('.flx', 'text/vnd.fmi.flexstor');
        this._setMimeType('.gv', 'text/vnd.graphviz');
        this._setMimeType('.3dml', 'text/vnd.in3d.3dml');
        this._setMimeType('.spot', 'text/vnd.in3d.spot');
        this._setMimeType('.jad', 'text/vnd.sun.j2me.app-descriptor');
        this._setMimeType('.wml', 'text/vnd.wap.wml');
        this._setMimeType('.wmls', 'text/vnd.wap.wmlscript');
        this._setMimeType('.s,.asm', 'text/x-asm');
        this._setMimeType('.c,.cc,.cxx,.cpp,.h,.hh,.dic', 'text/x-c');
        this._setMimeType('.f,.for,.f77,.f90', 'text/x-fortran');
        this._setMimeType('.p,.pas', 'text/x-pascal');
        this._setMimeType('.java', 'text/x-java-source');
        this._setMimeType('.etx', 'text/x-setext');
        this._setMimeType('.uu', 'text/x-uuencode');
        this._setMimeType('.vcs', 'text/x-vcalendar');
        this._setMimeType('.vcf', 'text/x-vcard');
        this._setMimeType('.3gp', 'video/3gpp');
        this._setMimeType('.3g2', 'video/3gpp2');
        this._setMimeType('.h261', 'video/h261');
        this._setMimeType('.h263', 'video/h263');
        this._setMimeType('.h264', 'video/h264');
        this._setMimeType('.jpgv', 'video/jpeg');
        this._setMimeType('.jpm,.jpgm', 'video/jpm');
        this._setMimeType('.mj2,.mjp2', 'video/mj2');
        this._setMimeType('.mp4,.mp4v,.mpg4,.m4v', 'video/mp4');
        this._setMimeType('.mkv,.mk3d,.mka,.mks', 'video/x-matroska');
        this._setMimeType('.webm', 'video/webm');
        this._setMimeType('.mpeg,.mpg,.mpe,.m1v,.m2v', 'video/mpeg');
        this._setMimeType('.ogv', 'video/ogg');
        this._setMimeType('.qt,.mov', 'video/quicktime');
        this._setMimeType('.fvt', 'video/vnd.fvt');
        this._setMimeType('.mxu,.m4u', 'video/vnd.mpegurl');
        this._setMimeType('.pyv', 'video/vnd.ms-playready.media.pyv');
        this._setMimeType('.viv', 'video/vnd.vivo');
        this._setMimeType('.dv,.dif', 'video/x-dv');
        this._setMimeType('.f4v', 'video/x-f4v');
        this._setMimeType('.fli', 'video/x-fli');
        this._setMimeType('.flv', 'video/x-flv');
        this._setMimeType('.asf,.asx', 'video/x-ms-asf');
        this._setMimeType('.wm', 'video/x-ms-wm');
        this._setMimeType('.wmv', 'video/x-ms-wmv');
        this._setMimeType('.wmx', 'video/x-ms-wmx');
        this._setMimeType('.wvx', 'video/x-ms-wvx');
        this._setMimeType('.avi', 'video/x-msvideo');
        this._setMimeType('.movie', 'video/x-sgi-movie');
        this._setMimeType('.ice', 'x-conference/x-cooltalk');
        this._setMimeType('.indd', 'application/x-indesign');
        this._setMimeType('.dat', 'application/octet-stream');
        this._setMimeType('.gz', 'application/x-gzip');
        this._setMimeType('.tgz', 'application/x-tar');
        this._setMimeType('.tar', 'application/x-tar');
        this._setMimeType('.epub', 'application/epub+zip');
        this._setMimeType('.mobi', 'application/x-mobipocket-ebook');
    }

    private _errorHandler(error: any): Observable<any> {
        let json;
        try {
            json = error.json();
        } catch (e) {
            return observableThrowError(error);
        }

        return observableThrowError(json);
    }

    private _get(url: string): Observable<any> {
        return this._http
                .get(url, this._generateRequestOptions()).pipe(
                map(this._mapResponse),
                catchError(this._errorHandler),);
    }

    private _mapResponse(response: Response): any {
        let json;
        try {
            json = response.json();
        } catch (e) {
            throw new Error(response.toString());
        }

        if (typeof json.status !== 'undefined' && json.status === 'error') {
            throw new Error(json.message);
        }

        return json;
    }


    private _download(url: string): Observable<any> {
        return this._http
            .get(url, { responseType: ResponseContentType.Blob }).pipe(
            catchError(this._errorHandler));
    }

    private _delete(url: string): Observable<any> {
        return this._http
            .delete(url, this._generateRequestOptions()).pipe(
            catchError(this._errorHandler));
    }

    private _generateRequestOptions(): RequestOptionsArgs {
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Accept', 'application/json');
        options.headers.append('Content-Type', 'application/json');
        return options;
    }


    download(url: string, filename: string = 'file'): void {
        this._download(url)
            .subscribe(
              response => {
                var blob = new Blob([response._body], { type: response._body.type });
                saveAs(blob, filename + this._getMimeTypeExtension(response._body.type));
              },
              error => {
                this._notificationService.error(error.status);
              }
            );
    }

    getUploadedDocument( documentType: string) {
      const url = `${ENVIRONMENT.service.document}/member/me/docs?doc_type=${documentType}`;
      return this._get(url);
    }

    deleteUploadedDocument(id: number | string, actorId: string) {
        const url = ENVIRONMENT.service.document  + '/docs' + '/' + id + '?actor=' + actorId;
        return this._delete(url);
    }

    private _getMimeTypeExtension(mimeType: string): void {
        const result = this.mimeTypes.find(element => {
            return element.mimeType === mimeType;
        });
        return result ? result.extension : '';
    }

    private _setMimeType(extension: string, mimeType: string): void {
        this.mimeTypes.push({
            extension: extension,
            mimeType: mimeType
        });
    }
}

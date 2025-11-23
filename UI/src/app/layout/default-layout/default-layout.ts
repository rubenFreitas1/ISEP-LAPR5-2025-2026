import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { PermissionService } from '../../services/permission.service';
import { filterNavItems } from './_nav_filter';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';
import {DefaultFooter, DefaultHeader} from './'
import { navItems } from './_nav';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.html',
  styleUrls: ['./default-layout.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooter,
    DefaultHeader,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    TranslateModule
  ]
})
export class DefaultLayout {
  public filteredNav: any[] = [];

  constructor(private permissions: PermissionService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.permissions.loadRoleFromStorage().then(() => {
      // compute filtered nav and translate labels
      const computeAndTranslate = () => {
        const filtered = filterNavItems(navItems, this.permissions);
        this.filteredNav = this.translateNav(filtered);
      };

      computeAndTranslate();

      this.permissions.roleChanges().subscribe(() => {
        computeAndTranslate();
      });

      // re-translate when language changes
      this.translate.onLangChange.subscribe(() => {
        computeAndTranslate();
      });
    });
  }

  private translateNav(items: any[]): any[] {
    return items.map(item => ({
      ...item,
      name: this.translate.instant(item.name),
      children: item.children ? this.translateNav(item.children) : undefined
    }));
  }
}

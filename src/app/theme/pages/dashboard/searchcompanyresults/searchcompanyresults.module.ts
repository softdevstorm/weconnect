import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { SearchCompanyResultsComponent } from "./searchcompanyresults.component";
import { LayoutModule } from "../../../layouts/layout.module";
import { DashboardComponent } from "../dashboard.component";
import { SendFormDataService } from "../../../../_services/send-form-data.service";

const routes: Routes = [
    {
        path: "",
        component: DashboardComponent,
        children: [
            {
                path: "",
                component: SearchCompanyResultsComponent
            }
        ]
    }
];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule],
    exports: [RouterModule],
    declarations: [SearchCompanyResultsComponent],
    providers: [SendFormDataService]
})
export class SearchCompanyResultsModule { }

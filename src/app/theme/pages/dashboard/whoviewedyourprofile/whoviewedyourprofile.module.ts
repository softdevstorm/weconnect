import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { WhoViewedYourProfileComponent } from "./whoviewedyourprofile.component";
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
                component: WhoViewedYourProfileComponent
            }
        ]
    }
];
@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule],
    exports: [RouterModule],
    declarations: [WhoViewedYourProfileComponent],
    providers: [SendFormDataService]
})
export class WhoViewedYourProfileModule { }

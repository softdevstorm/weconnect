import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit
} from "@angular/core";
import { Helpers } from "../../../../helpers";
import { ScriptLoaderService } from "../../../../_services/script-loader.service";
import { DataService } from "../../../../_services/data.service";
import { SendFormDataService } from "../../../../_services/send-form-data.service";

@Component({
    selector: "app-outreach-campaign",
    templateUrl: "./outreachcampaign.component.html",
    encapsulation: ViewEncapsulation.None
})
export class OutreachCampaignComponent implements OnInit, AfterViewInit {
    data: any;
    outreachcampaigns: Array<object> = [];

    constructor(
        private _script: ScriptLoaderService,
        private dataService: DataService,
        private sendformdataService: SendFormDataService
    ) { }

    ngOnInit() {
        this.dataService.getOutreachCampaigns().subscribe(
            data => {
                this.outreachcampaigns = data;
                setTimeout(() => {
                    var table = (<any>$("#m_table_1")).DataTable({
                        responsive: true,

                        //== DOM Layout settings

                        lengthMenu: [5, 10, 25, 50],

                        pageLength: 10,

                        //== Order settings
                        order: [[1, "desc"]],

                        headerCallback: function(thead, data, start, end, display) {
                            thead.getElementsByTagName("th")[0].innerHTML = `
                                <label class="m-checkbox m-checkbox--single m-checkbox--solid m-checkbox--brand">
                                    <input type="checkbox" value="" class="m-group-checkable">
                                    <span></span>
                                </label>`;
                        },

                        columnDefs: [
                            {
                                targets: 0,
                                width: "30px",
                                className: "dt-right",
                                orderable: false,
                                render: function(data, type, full, meta) {
                                    return `
                                    <label class="m-checkbox m-checkbox--single m-checkbox--solid m-checkbox--brand">
                                        <input type="checkbox" value="" class="m-checkable">
                                        <span></span>
                                    </label>`;
                                }
                            },
                            {
                                targets: 5,
                                render: function(data, type, full, meta) {
                                    var status = {
                                        Active: {
                                            title: "Active",
                                            class: "m-badge--primary"
                                        },
                                        Completed: {
                                            title: "Completed",
                                            class: "m-badge--danger"
                                        },
                                        Pending: {
                                            title: "Pending",
                                            class: "m-badge--brand"
                                        },
                                        Paused: {
                                            title: "Paused",
                                            class: "m-badge--metal"
                                        }
                                    };
                                    if (typeof status[data] === "undefined") {
                                        return data;
                                    }
                                    return (
                                        '<span class="m-badge ' +
                                        status[data].class +
                                        ' m-badge--wide">' +
                                        status[data].title +
                                        "</span>"
                                    );
                                }
                            },
                            {
                                targets: 6,
                                render: function(data, type, full, meta) {
                                    var status = {
                                        Connection: {
                                            title: "Connection",
                                            state: "primary"
                                        },
                                        Messaging: {
                                            title: "Messaging",
                                            state: "info"
                                        },
                                        Endorse: {
                                            title: "Endorse",
                                            state: "primary"
                                        },
                                        Follow: {
                                            title: "Follow",
                                            state: "info"
                                        }
                                    };
                                    if (typeof status[data] === "undefined") {
                                        return data;
                                    }
                                    return (
                                        '<span class="m-badge m-badge--' +
                                        status[data].state +
                                        ' m-badge--dot"></span>&nbsp;' +
                                        '<span class="m--font-bold m--font-' +
                                        status[data].state +
                                        '">' +
                                        status[data].title +
                                        "</span>"
                                    );
                                }
                            },
                            {
                                targets: -1,
                                title: "Actions",
                                orderable: false,
                                render: function(data, type, full, meta) {
                                    return '\
                                    <span class="dropdown"> \
                                        <a href="javascript:;" class="btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown" aria-expanded="true"> \
                                          <i class="la la-ellipsis-h"></i> \
                                        </a> \
                                        <div class="dropdown-menu dropdown-menu-right"> \
                                            <a class="dropdown-item copy-action" href="javascript:;"><i class="la la-copy"></i> Copy</a> \
                                            <a class="dropdown-item delete-action" href="javascript:;"><i class="la la-trash"></i> Delete</a> \
                                        </div> \
                                    </span> \
                                    <a href="/campaign-overview" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill" title="View"> \
                                        <i class="la la-edit"></i> \
                                    </a> \
                                    <a href="javascript:;" class="m-portlet__nav-link btn m-btn m-btn--hover-brand m-btn--icon m-btn--icon-only m-btn--pill pause-action" title="Pause Campaign" data-id="' + data + '"> \
                                           <i class="la la-pause"></i> \
                                    </a>';
                                }
                            }
                        ]
                    });
                }, 200);
            },
            error => {
                console.log(error);
                this.outreachcampaigns = [];
            }
        );
        let that = this;
        jQuery(document)
            .on("change", ".m-group-checkable", function() {
                var e = $(this).closest("table").find("td:first-child .m-checkable"),
                    a = $(this).is(":checked");
                $(e).each(function() {
                    a ? ($(this).prop("checked", !0), $(this).closest("tr").addClass("active")) : ($(this).prop("checked", !1), $(this).closest("tr").removeClass("active"))
                })
            });

        jQuery(document)
            .on("change", "tbody tr .m-checkbox", function() {
                $(this).parents("tr").toggleClass("active")
            });

        jQuery(document)
            .off('click', '.pause-action').on('click', '.pause-action', function() {
                var id = $(this).closest('.action').attr('data-id');
                that.actionPause(id);
            });

        jQuery(document)
            .off('click', '.copy-action').on('click', '.copy-action', function() {
                var id = $(this).closest('.action').attr('data-id');
                that.actionCopy(id);
            });

        jQuery(document)
            .off('click', '.delete-action').on('click', '.delete-action', function() {
                var id = $(this).closest('.action').attr('data-id');
                that.actionDelete(id);
            });

        this._script
            .loadScripts(
            "body",
            ["assets/vendors/custom/datatables/datatables.bundle.js"],
            true
            )
            .then(result => {

            });
    }

    ngAfterViewInit() { }

    actionDelete(id: string) {
        this.sendformdataService.sendId(id).subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }

    actionPause(id: string) {
        this.sendformdataService.sendId(id).subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }

    actionCopy(id: string) {
        this.sendformdataService.sendId(id).subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log(error);
            });
    }
}

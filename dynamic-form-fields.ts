interface Field
{
    fieldId: number,
    inputType: string,
    label: string,
    type: string,
    required: boolean,
    max: number;
    min: number;
    regex: string;
    isMulti: boolean;
}

interface Form
{
    formId: number;
    fields: Field[];
    isLoginRequired: boolean;
    canResubmit: boolean;
    canReceiveCopy: boolean;
}

enum FormSubmissionStatuses {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
}

interface FilledField extends Pick<Field, 'fieldId' | 'label'> {
 value: string;
}

interface FormSubmission
{
    userId: number;
    formId: number;
    status: FormSubmissionStatuses;
    fields: FilledField[]
}

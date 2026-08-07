import { JobStatus } from "@prisma/client";

interface JobProps {
  id: string | undefined;
  userId: string;
  title: string;
  company: string;
  url: string;

  location: string | undefined;
  salaryExpect: string | undefined;
  description: string | undefined;
  currentStatus: JobStatus;
}

interface UpdateJobProps {
  title: string;
  company: string;
  url: string;

  location: string | undefined;
  salaryExpect: string | undefined;
  description: string | undefined;
  currentStatus: JobStatus;
}

class JobEntity {
  private _id: string | undefined;
  private _userId: string;
  private _title: string;
  private _company: string;
  private _url: string;

  private _location?: string | undefined;
  private _salaryExpect?: string | undefined;
  private _description?: string | undefined;
  private _currentStatus: JobStatus;

  private constructor(props: JobProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._title = props.title;
    this._company = props.company;
    this._url = props.url;
    this._location = props.location;
    this._salaryExpect = props.salaryExpect;
    this._description = props.description;
    this._currentStatus = props.currentStatus ?? JobStatus.APLICADO;
  }

  static create(props: JobProps) {
    return new JobEntity({
      ...props,
      currentStatus: JobStatus.APLICADO,
    });
  }
  static restore(props: JobProps) {
    return new JobEntity(props);
  }

  get id(): string | undefined {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get title(): string {
    return this._title;
  }
  get company(): string {
    return this._company;
  }
  get url(): string {
    return this._url;
  }
  get location(): string | undefined {
    return this._location;
  }
  get salaryExpect(): string | undefined {
    return this._salaryExpect;
  }
  get description(): string | undefined {
    return this._description;
  }
  get currentStatus(): JobStatus {
    return this._currentStatus;
  }

  update(props: UpdateJobProps): void {
    const {
      title,
      company,
      url,
      location,
      salaryExpect,
      description,
      currentStatus,
    } = props;

    this._title = title;
    this._company = company;
    this._url = url;
    this._location = location;
    this._salaryExpect = salaryExpect;
    this._description = description;
    this._currentStatus = currentStatus;
  }

  changeStatus(newStatus: JobStatus): void {
    this._currentStatus = newStatus;
  }

  toPersistence(): JobProps {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title,
      company: this._company,
      url: this._url,
      location: this._location,
      salaryExpect: this._salaryExpect,
      description: this._description,
      currentStatus: this._currentStatus,
    };
  }
}

export default JobEntity;

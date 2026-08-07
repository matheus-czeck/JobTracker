import { AppError } from "../../shared/errors/app.error.js";
import type { ResponseJobDto } from "./job.dto.js";
import type JobEntity from "./job.entity.js";

class JobMapper {
  static toResponse(job: JobEntity): ResponseJobDto {
    if (!job.id) throw new AppError("Job precisa de Id", 400);

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      url: job.url,
      location: job.location,
      salaryExpect: job.salaryExpect,
      description: job.description,
      currentStatus: job.currentStatus,
    };
  }
}

export default JobMapper;

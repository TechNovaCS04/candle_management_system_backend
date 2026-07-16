import { Op, WhereOptions } from "sequelize";
import { Attendance, Employee, EmployeePosition } from "../models";
import { mapAttendance, mapEmployee } from "../mappers";
import { AppError, assertFound } from "../utils/AppError";
import { PaginationQuery, paginatedResponse } from "../utils/pagination";

export class EmployeeService {
  async list(q: PaginationQuery) {
    const where: WhereOptions = {};
    if (q.isActive !== undefined) Object.assign(where, { is_active: q.isActive });
    if (q.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q.search}%` } },
          { contact_no: { [Op.iLike]: `%${q.search}%` } },
        ],
      });
    }

    const { rows, count } = await Employee.findAndCountAll({
      where,
      limit: q.pageSize,
      offset: q.offset,
      order: [["created_at", "DESC"]],
    });

    return paginatedResponse(rows.map(mapEmployee), count, q.page, q.pageSize);
  }

  async getById(id: string) {
    return mapEmployee(assertFound(await Employee.findByPk(id)));
  }

  async create(input: {
    name: string;
    position: EmployeePosition;
    phone: string;
    salary: number;
    joinedDate?: string;
    email?: string;
    address?: string;
  }) {
    const employee = await Employee.create({
      name: input.name,
      position: input.position,
      contact_no: input.phone,
      salary: input.salary,
      joined_date: input.joinedDate || null,
      email_address: input.email || null,
      address: input.address || null,
    });
    return mapEmployee(employee);
  }

  async update(
    id: string,
    input: {
      name: string;
      position: EmployeePosition;
      phone: string;
      salary: number;
      joinedDate?: string;
      email?: string;
      address?: string;
    }
  ) {
    const employee = assertFound(await Employee.findByPk(id));
    await employee.update({
      name: input.name,
      position: input.position,
      contact_no: input.phone,
      salary: input.salary,
      joined_date: input.joinedDate || null,
      email_address: input.email || null,
      address: input.address || null,
    });
    return mapEmployee(employee);
  }

  async remove(id: string) {
    const employee = assertFound(await Employee.findByPk(id));
    await employee.destroy();
    return { message: "Employee deleted" };
  }
}

export class AttendanceService {
  async list(q: PaginationQuery) {
    const { rows, count } = await Attendance.findAndCountAll({
      include: [{ model: Employee, as: "employee" }],
      limit: q.pageSize,
      offset: q.offset,
      order: [["date", "DESC"]],
    });

    return paginatedResponse(
      rows.map((a) => mapAttendance(a as Attendance & { employee?: Employee })),
      count,
      q.page,
      q.pageSize
    );
  }

  async getById(id: string) {
    const record = assertFound(
      await Attendance.findByPk(id, { include: [{ model: Employee, as: "employee" }] })
    );
    return mapAttendance(record as Attendance & { employee?: Employee });
  }

  async create(input: { employeeId: string; date: string; status: Attendance["status"] }) {
    assertFound(await Employee.findByPk(input.employeeId), "Employee not found");
    try {
      const record = await Attendance.create({
        employee_id: input.employeeId,
        date: input.date,
        status: input.status,
      });
      return this.getById(record.id);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "name" in err && err.name === "SequelizeUniqueConstraintError") {
        throw new AppError("Attendance already recorded for this employee on this date", 409);
      }
      throw err;
    }
  }

  async update(id: string, input: { employeeId: string; date: string; status: Attendance["status"] }) {
    const record = assertFound(await Attendance.findByPk(id));
    assertFound(await Employee.findByPk(input.employeeId), "Employee not found");
    await record.update({
      employee_id: input.employeeId,
      date: input.date,
      status: input.status,
    });
    return this.getById(id);
  }

  async remove(id: string) {
    const record = assertFound(await Attendance.findByPk(id));
    await record.destroy();
    return { message: "Attendance deleted" };
  }
}

export const employeeService = new EmployeeService();
export const attendanceService = new AttendanceService();

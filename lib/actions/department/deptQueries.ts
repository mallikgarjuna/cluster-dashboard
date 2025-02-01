import "server-only";

import prisma from "@/prisma/client";

async function getDepartmentShortNames() {
  const deptsWithNameShort = await prisma.department.findMany({
    select: { nameShort: true },
  });

  const depts = deptsWithNameShort.map((dept) => dept.nameShort);

  return depts;
}

// ************* Export functions for use in other files ******
export { getDepartmentShortNames };

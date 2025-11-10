export default () =>
  <thead className="rounded-lg text-left text-sm font-normal">
    <tr>
      {["Provider", "Resource", "Misconfiguration ID", "Date"].map(
        (text, idx) => (
          <th key={idx}
            scope="col"
            className="px-4 py-5 font-medium"
          >
            {text}
          </th>
        ),
      )}
      <th
        scope="col"
        className="relative py-3 pl-6 pr-3"
      >
        <span className="sr-only">Edit</span>
      </th>
    </tr>
  </thead>

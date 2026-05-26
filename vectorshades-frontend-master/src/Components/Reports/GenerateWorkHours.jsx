import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { generateWorkHoursController } from "../../Controllers/Reports";

const asIso = (d) => {
  if (!d) return undefined;
  const v = dayjs(d);
  if (!v.isValid()) return undefined;
  return v.toDate().toISOString();
};

const formatRangeLabel = ({ startDate, endDate }) => {
  const s = startDate ? dayjs(startDate).format("MMM D, YYYY") : "";
  const e = endDate ? dayjs(endDate).format("MMM D, YYYY") : "";
  return `${s} → ${e}`;
};

export default function GenerateWorkHours() {
  const [startDate, setStartDate] = useState(dayjs().startOf("day").subtract(2, "day"));
  const [endDate, setEndDate] = useState(dayjs().startOf("day"));
  const [concurrency, setConcurrency] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const rangeLabel = useMemo(
    () =>
      formatRangeLabel({
        startDate,
        endDate,
      }),
    [startDate, endDate]
  );

  const onGenerate = async () => {
    const body = { startDate: asIso(startDate), endDate: asIso(endDate), concurrency: Number(concurrency) || 1 };

    setSubmitting(true);
    setResult(null);
    try {
      const req = generateWorkHoursController(body);
      toast.promise(req, {
        pending: "Generating work hours…",
        success: "Generation complete",
        error: "Failed to generate work hours",
      });
      const { data } = await req;
      setResult(data);
    } catch (e) {
      setResult(null);
    } finally {
      setSubmitting(false);
    }
  };

  const generation = result?.response?.generation;
  const email = result?.response?.email;

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", px: 2, py: 3 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Generate Work Hours
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            Generate worked-hours logs for employees for a selected date range, then you’ll receive an email confirmation.
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ md: "center" }}>
                <Typography sx={{ fontWeight: 800 }}>Date range</Typography>
                <Box sx={{ flex: 1 }} />
                <Chip
                  label={rangeLabel}
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(230, 72, 72, 0.45)",
                    color: "#e64848",
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Divider />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <DatePicker
                    label="Start date"
                    value={startDate}
                    onChange={(v) => setStartDate(v)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <DatePicker
                    label="End date"
                    value={endDate}
                    onChange={(v) => setEndDate(v)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Stack>
              </LocalizationProvider>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                <TextField
                  label="Concurrency"
                  type="number"
                  value={concurrency}
                  onChange={(e) => setConcurrency(e.target.value)}
                  inputProps={{ min: 1, max: 10 }}
                  helperText="Higher = faster, but heavier DB load."
                  sx={{ maxWidth: 260 }}
                />
                <Box sx={{ flex: 1 }} />
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGenerate}
                  disabled={submitting}
                  sx={{
                    borderRadius: 2,
                    minWidth: 220,
                    backgroundColor: "#e64848",
                    "&:hover": { backgroundColor: "#cf3e3e" },
                  }}
                >
                  {submitting ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} color="inherit" />
                      <span>Generating…</span>
                    </Stack>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </Stack>

              {submitting && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  This generation may take some time depending on the number of employees and days selected. Please don’t close or refresh the page while it’s running.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {result && (
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Result
                </Typography>

                {result?.failed ? (
                  <Alert severity="error">{result?.message || "Request failed"}</Alert>
                ) : (
                  <Alert severity="success">{result?.message || "Generated successfully"}</Alert>
                )}

                {!result?.failed && generation && (
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
                      <CardContent>
                        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Employees</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {generation.employees}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
                      <CardContent>
                        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Days</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {generation.days}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ borderRadius: 2, flex: 1 }}>
                      <CardContent>
                        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Updates</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {generation.updated}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Stack>
                )}

                {!result?.failed && (
                  <Alert severity={email?.sent ? "info" : "warning"}>
                    {email?.sent
                      ? "Email acknowledgement was sent to your account."
                      : "Email acknowledgement was not sent (missing email or SMTP error)."}
                    {email?.error ? ` (${email.error})` : ""}
                  </Alert>
                )}

                {!result?.failed && generation?.dateStrings?.length > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Dates processed</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {generation.dateStrings.map((d) => (
                        <Chip key={d} label={d} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}


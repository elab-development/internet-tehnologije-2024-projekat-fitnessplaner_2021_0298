<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Summary</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h2>Daily Summary for {{ $date }}</h2>

    <h3>Nutrition</h3>
    <table>
        <tr>
            <th>Meal Type</th>
            <th>Calories</th>
        </tr>
        @foreach($nutrition as $entry)
        <tr>
            <td>{{ $entry->meal_type }}</td>
            <td>{{ $entry->calories }}</td>
        </tr>
        @endforeach
    </table>

    <h3>Hydration</h3>
    <table>
        <tr>
            <th>Amount (ml)</th>
        </tr>
        @foreach($hydration as $entry)
        <tr>
            <td>{{ $entry->amount_ml }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>
